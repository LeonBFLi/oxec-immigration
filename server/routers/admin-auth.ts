import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  validatePassword,
  hashPassword,
  verifyPassword,
  getAdminByUsername,
  getAdminById,
  createAdminSession,
  verifyAdminSession,
  invalidateAdminSession,
  generateTOTPSecret,
  verifyTOTP,
  getMFAConfig,
  recordMFAAttempt,
  checkMFAAttemptLimit,
  updateAdminLastLogin,
} from '../auth-admin';
import { getDb } from '../db';
import { admins, mfaConfigs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Admin authentication router
 * Handles login, MFA setup, MFA verification, and session management
 */
export const adminAuthRouter = router({
  /**
   * Step 1: Admin login with username and password
   * Returns session token if MFA is not enabled, or MFA challenge if enabled
   */
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, '用户名不能为空'),
        password: z.string().min(1, '密码不能为空'),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminByUsername(input.username);

      if (!admin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '用户名或密码错误',
        });
      }

      if (!admin.isActive) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: '该账户已被禁用',
        });
      }

      const passwordValid = await verifyPassword(input.password, admin.passwordHash);
      if (!passwordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '用户名或密码错误',
        });
      }

      // If MFA is not enabled, create session and return token
      if (!admin.mfaEnabled) {
        const { token, expiresAt } = await createAdminSession(admin.id);
        await updateAdminLastLogin(admin.id);

        return {
          success: true,
          mfaRequired: false,
          token,
          expiresAt,
          admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
          },
        };
      }

      // MFA is enabled, return challenge
      return {
        success: true,
        mfaRequired: true,
        adminId: admin.id,
        mfaMethod: admin.mfaMethod,
        message: admin.mfaMethod === 'google_authenticator'
          ? '请输入Google Authenticator中的6位验证码'
          : '验证码已发送到您的手机，请输入6位验证码',
      };
    }),

  /**
   * Step 2: Verify MFA code (TOTP or SMS)
   * Returns session token after successful MFA verification
   */
  verifyMFA: publicProcedure
    .input(
      z.object({
        adminId: z.number(),
        code: z.string().length(6, '验证码必须是6位数字'),
        method: z.enum(['google_authenticator', 'sms']),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminById(input.adminId);
      if (!admin || !admin.mfaEnabled) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '无效的MFA请求',
        });
      }

      // Check rate limit
      const canAttempt = await checkMFAAttemptLimit(input.adminId);
      if (!canAttempt) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: '尝试次数过多，请稍后再试',
        });
      }

      const mfaConfig = await getMFAConfig(input.adminId);
      if (!mfaConfig) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'MFA配置未找到',
        });
      }

      let verified = false;

      if (input.method === 'google_authenticator' && mfaConfig.totpSecret) {
        verified = verifyTOTP(mfaConfig.totpSecret, input.code);
      } else if (input.method === 'sms') {
        // TODO: Implement SMS verification
        // For now, we'll accept any 6-digit code as a placeholder
        verified = /^\d{6}$/.test(input.code);
      }

      const attemptType = input.method === 'google_authenticator' ? 'totp' : 'sms';
      await recordMFAAttempt(input.adminId, attemptType, verified);

      if (!verified) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '验证码错误，请重试',
        });
      }

      // Create session after successful MFA
      const { token, expiresAt } = await createAdminSession(admin.id);
      await updateAdminLastLogin(admin.id);

      return {
        success: true,
        token,
        expiresAt,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      };
    }),

  /**
   * Verify current session
   */
  verifySession: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const result = await verifyAdminSession(input.token);

      if (!result.valid || !result.adminId) {
        return { valid: false };
      }

      const admin = await getAdminById(result.adminId);
      if (!admin) {
        return { valid: false };
      }

      return {
        valid: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      };
    }),

  /**
   * Logout - invalidate session
   */
  logout: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      await invalidateAdminSession(input.token);
      return { success: true };
    }),

  /**
   * Initialize MFA setup - generate TOTP secret and QR code
   */
  initMFASetup: publicProcedure
    .input(
      z.object({
        adminId: z.number(),
        method: z.enum(['google_authenticator', 'sms']),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminById(input.adminId);
      if (!admin) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '管理员不存在',
        });
      }

      if (input.method === 'google_authenticator') {
        const { secret, qrCode, backupCodes } = await generateTOTPSecret(
          input.adminId,
          admin.email
        );

        // Store temporary TOTP secret (not yet verified)
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        await db
          .insert(mfaConfigs)
          .values({
            adminId: input.adminId,
            totpSecret: secret,
            backupCodes: JSON.stringify(backupCodes),
          })
          .onDuplicateKeyUpdate({ set: { totpSecret: secret, backupCodes: JSON.stringify(backupCodes) } });

        return {
          success: true,
          method: 'google_authenticator',
          qrCode,
          secret,
          backupCodes,
          message: '请使用Google Authenticator扫描二维码，然后输入验证码完成设置',
        };
      } else if (input.method === 'sms' && input.phoneNumber) {
        // TODO: Implement SMS code generation and sending
        const db = await getDb();
        if (!db) throw new Error('Database not available');

        await db
          .update(admins)
          .set({ phoneNumber: input.phoneNumber })
          .where(eq(admins.id, input.adminId));

        return {
          success: true,
          method: 'sms',
          message: '验证码已发送到您的手机',
        };
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: '无效的MFA方法',
      });
    }),

  /**
   * Confirm MFA setup - verify code and enable MFA
   */
  confirmMFASetup: publicProcedure
    .input(
      z.object({
        adminId: z.number(),
        code: z.string().length(6, '验证码必须是6位数字'),
        method: z.enum(['google_authenticator', 'sms']),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminById(input.adminId);
      if (!admin) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '管理员不存在',
        });
      }

      const mfaConfig = await getMFAConfig(input.adminId);
      if (!mfaConfig) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'MFA配置未找到',
        });
      }

      let verified = false;

      if (input.method === 'google_authenticator' && mfaConfig.totpSecret) {
        verified = verifyTOTP(mfaConfig.totpSecret, input.code);
      } else if (input.method === 'sms') {
        // TODO: Implement SMS verification
        verified = /^\d{6}$/.test(input.code);
      }

      if (!verified) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '验证码错误，请重试',
        });
      }

      // Enable MFA
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db
        .update(admins)
        .set({
          mfaEnabled: true,
          mfaMethod: input.method,
        })
        .where(eq(admins.id, input.adminId));

      // Mark MFA config as verified
      await db
        .update(mfaConfigs)
        .set({ verifiedAt: new Date() })
        .where(eq(mfaConfigs.adminId, input.adminId));

      return {
        success: true,
        message: 'MFA已成功启用',
      };
    }),

  /**
   * Disable MFA
   */
  disableMFA: publicProcedure
    .input(
      z.object({
        adminId: z.number(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const admin = await getAdminById(input.adminId);
      if (!admin) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '管理员不存在',
        });
      }

      // Verify password before disabling MFA
      const passwordValid = await verifyPassword(input.password, admin.passwordHash);
      if (!passwordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: '密码错误',
        });
      }

      const db = await getDb();
      if (!db) throw new Error('Database not available');

      await db
        .update(admins)
        .set({
          mfaEnabled: false,
          mfaMethod: 'none',
        })
        .where(eq(admins.id, input.adminId));

      return {
        success: true,
        message: 'MFA已禁用',
      };
    }),
});
