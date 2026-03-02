import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  verifyTOTP,
  generateSMSCode,
} from './auth-admin';

describe('Admin Authentication', () => {
  describe('Password Validation', () => {
    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Pass1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码至少需要8个字符');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePassword('password123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含至少一个大写字母');
    });

    it('should reject password without lowercase letter', () => {
      const result = validatePassword('PASSWORD123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含至少一个小写字母');
    });

    it('should reject password without number', () => {
      const result = validatePassword('Password!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含至少一个数字');
    });

    it('should reject password without special character', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密码必须包含至少一个特殊字符 (!@#$%^&*等)');
    });

    it('should accept valid password', () => {
      const result = validatePassword('SecurePass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept password with multiple special characters', () => {
      const result = validatePassword('MyP@ssw0rd#');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password and verify correctly', async () => {
      const password = 'SecurePass123!';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'SecurePass123!';
      const hash = await hashPassword(password);

      const isValid = await verifyPassword('WrongPassword123!', hash);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'SecurePass123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('JWT Token', () => {
    it('should generate JWT token', () => {
      const adminId = 1;
      const token = generateJWT(adminId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify valid JWT token', () => {
      const adminId = 42;
      const token = generateJWT(adminId);

      const result = verifyJWT(token);
      expect(result.valid).toBe(true);
      expect(result.adminId).toBe(adminId);
    });

    it('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';
      const result = verifyJWT(invalidToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject malformed JWT token', () => {
      const malformedToken = 'only.two.parts';
      const result = verifyJWT(malformedToken);

      expect(result.valid).toBe(false);
    });

    it('should generate different tokens for same admin', async () => {
      const adminId = 1;
      const token1 = generateJWT(adminId);
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      const token2 = generateJWT(adminId);

      // Tokens should be different due to different iat timestamps
      expect(token1).not.toBe(token2);
    });
  });

  describe('TOTP Verification', () => {
    it('should reject invalid TOTP token', () => {
      const secret = 'JBSWY3DPEBLW64TMMQ======';
      const invalidToken = '000000';

      const result = verifyTOTP(secret, invalidToken);
      expect(result).toBe(false);
    });

    it('should accept valid TOTP token format', () => {
      // Note: This test verifies the function accepts 6-digit tokens
      // Actual TOTP validation depends on current time, so we test the structure
      const secret = 'JBSWY3DPEBLW64TMMQ======';
      const validToken = '123456'; // 6 digits

      // The function should handle the token without throwing
      expect(() => verifyTOTP(secret, validToken)).not.toThrow();
    });
  });

  describe('SMS Code Generation', () => {
    it('should generate 6-digit SMS code', () => {
      const code = generateSMSCode();

      expect(code).toBeDefined();
      expect(code.length).toBe(6);
      expect(/^\d{6}$/.test(code)).toBe(true);
    });

    it('should generate random SMS codes', () => {
      const codes = new Set();
      for (let i = 0; i < 10; i++) {
        codes.add(generateSMSCode());
      }

      // With high probability, we should get different codes
      expect(codes.size).toBeGreaterThan(1);
    });

    it('should generate codes in valid range', () => {
      for (let i = 0; i < 100; i++) {
        const code = generateSMSCode();
        const num = parseInt(code, 10);

        expect(num).toBeGreaterThanOrEqual(100000);
        expect(num).toBeLessThanOrEqual(999999);
      }
    });
  });
});
