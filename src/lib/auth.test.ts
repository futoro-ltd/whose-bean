import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const originalEnv = { ...process.env };

describe('auth', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    vi.resetModules();
    process.env = originalEnv;
  });

  describe('hashPassword / verifyPassword', () => {
    it('hashes and verifies password correctly', async () => {
      const { hashPassword, verifyPassword } = await import('./auth');

      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(await verifyPassword(password, hash)).toBe(true);
      expect(await verifyPassword('wrong', hash)).toBe(false);
    });

    it('produces different hashes for same password (salt)', async () => {
      const { hashPassword } = await import('./auth');

      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateToken / verifyToken', () => {
    it('generates and verifies token correctly', async () => {
      const { generateToken, verifyToken } = await import('./auth');

      const userId = 'user-123';
      const token = generateToken(userId);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(userId);
    });

    it('returns null for invalid token', async () => {
      const { verifyToken } = await import('./auth');

      expect(verifyToken('invalid-token')).toBeNull();
      expect(verifyToken('')).toBeNull();
    });

    it('returns null for tampered token', async () => {
      const { generateToken, verifyToken } = await import('./auth');

      const token = generateToken('user-123');
      const tampered = token.slice(0, -5) + 'xxxxx';

      expect(verifyToken(tampered)).toBeNull();
    });
  });
});
