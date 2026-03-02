import bcryptjs from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { getDb } from './db';
import { admins, mfaConfigs, adminSessions, mfaAttempts } from '../drizzle/schema';
import { eq, and, gt } from 'drizzle-orm';

const SALT_ROUNDS = 10;
const SESSION_EXPIRY_HOURS = 8;
const MFA_ATTEMPT_LIMIT = 5;
const MFA_ATTEMPT_WINDOW_MINUTES = 15;

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码至少需要8个字符');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符 (!@#$%^&*等)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate JWT token for admin session
 */
export function generateJWT(adminId: number, expiresIn: number = SESSION_EXPIRY_HOURS * 3600): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      adminId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    })
  ).toString('base64url');

  const signature = Buffer.from(`${header}.${payload}`).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

/**
 * Verify JWT token
 */
export function verifyJWT(token: string): { valid: boolean; adminId?: number; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, adminId: payload.adminId };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

/**
 * Generate TOTP secret for Google Authenticator
 */
export async function generateTOTPSecret(_adminId: number, email: string): Promise<{
  secret: string;
  qrCode: string;
  backupCodes: string[];
}> {
  const secret = speakeasy.generateSecret({
    name: `OXEC Admin (${email})`,
    issuer: 'OXEC Immigration',
    length: 32,
  });

  if (!secret.base32) {
    throw new Error('Failed to generate TOTP secret');
  }

  // Generate QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

/**
 * Verify TOTP token
 */
export function verifyTOTP(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time windows (30 seconds each)
  });
}

/**
 * Generate SMS verification code
 */
export function generateSMSCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create admin session
 */
export async function createAdminSession(
  adminId: number,
  ipAddress?: string,
  userAgent?: string
): Promise<{ token: string; expiresAt: Date }> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const token = generateJWT(adminId);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 3600 * 1000);

  await db.insert(adminSessions).values({
    adminId,
    token,
    expiresAt,
    ipAddress,
    userAgent,
    isActive: true,
  });

  return { token, expiresAt };
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(token: string): Promise<{ valid: boolean; adminId?: number }> {
  const jwtVerification = verifyJWT(token);
  if (!jwtVerification.valid) {
    return { valid: false };
  }

  const adminId = jwtVerification.adminId;
  if (!adminId) {
    return { valid: false };
  }

  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Check if session exists and is active
  const session = await db
    .select()
    .from(adminSessions)
    .where(and(eq(adminSessions.token, token), eq(adminSessions.isActive, true)))
    .limit(1);

  if (session.length === 0) {
    return { valid: false };
  }

  return { valid: true, adminId };
}

/**
 * Invalidate admin session
 */
export async function invalidateAdminSession(token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(adminSessions)
    .set({ isActive: false })
    .where(eq(adminSessions.token, token));
}

/**
 * Check MFA attempt rate limit
 */
export async function checkMFAAttemptLimit(adminId: number, ipAddress?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const windowStart = new Date(Date.now() - MFA_ATTEMPT_WINDOW_MINUTES * 60 * 1000);

  const recentAttempts = await db
    .select()
    .from(mfaAttempts)
    .where(
      and(
        eq(mfaAttempts.adminId, adminId),
        gt(mfaAttempts.createdAt, windowStart),
        eq(mfaAttempts.success, false)
      )
    );

  return recentAttempts.length < MFA_ATTEMPT_LIMIT;
}

/**
 * Record MFA attempt
 */
export async function recordMFAAttempt(
  adminId: number,
  attemptType: 'totp' | 'sms',
  success: boolean,
  ipAddress?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.insert(mfaAttempts).values({
    adminId,
    attemptType,
    success,
    ipAddress,
  });
}

/**
 * Get admin by username
 */
export async function getAdminByUsername(username: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  return result[0] || null;
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Get MFA config for admin
 */
export async function getMFAConfig(adminId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db.select().from(mfaConfigs).where(eq(mfaConfigs.adminId, adminId)).limit(1);
  return result[0] || null;
}

/**
 * Update admin last login
 */
export async function updateAdminLastLogin(adminId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db.update(admins).set({ lastLogin: new Date() }).where(eq(admins.id, adminId));
}
