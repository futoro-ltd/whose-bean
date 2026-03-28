import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  sanitizeUrl,
  sanitizeUUID,
  sanitizeNumeric,
  sanitizeDomain,
  isValidDomain,
} from './sanitize';

describe('sanitizeString', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString(123)).toBe('');
    expect(sanitizeString({})).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('truncates to maxLength', () => {
    expect(sanitizeString('hello world', 5)).toBe('hello');
    expect(sanitizeString('hello world', 100)).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(sanitizeString('')).toBe('');
  });
});

describe('sanitizeUrl', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeUrl(null)).toBe('');
    expect(sanitizeUrl(123)).toBe('');
  });

  it('truncates to 2048 chars then parses as URL', () => {
    const long = 'a'.repeat(3000);
    const result = sanitizeUrl(long);
    expect(result.length).toBeLessThanOrEqual(2048 + 18); // 18 = len("http://localhost/")
    expect(result.startsWith('http://localhost/')).toBe(true);
  });

  it('returns valid URL with localhost base', () => {
    expect(sanitizeUrl('example.com')).toBe('http://localhost/example.com');
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });

  it('trims whitespace', () => {
    expect(sanitizeUrl('  example.com  ')).toBe('http://localhost/example.com');
  });

  it('parses relative paths as URL with localhost base', () => {
    expect(sanitizeUrl('not a url')).toBe('http://localhost/not%20a%20url');
  });
});

describe('sanitizeUUID', () => {
  it('returns null for non-string input', () => {
    expect(sanitizeUUID(null)).toBeNull();
    expect(sanitizeUUID(123)).toBeNull();
    expect(sanitizeUUID({})).toBeNull();
  });

  it('returns null for invalid UUID format', () => {
    expect(sanitizeUUID('not-a-uuid')).toBeNull();
    expect(sanitizeUUID('12345')).toBeNull();
    expect(sanitizeUUID('')).toBeNull();
  });

  it('returns lowercase valid UUID', () => {
    expect(sanitizeUUID('12345678-1234-1234-1234-123456789ABC')).toBe(
      '12345678-1234-1234-1234-123456789abc'
    );
  });

  it('accepts valid UUIDs', () => {
    expect(sanitizeUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000'
    );
  });
});

describe('sanitizeNumeric', () => {
  it('returns null for non-numeric strings', () => {
    expect(sanitizeNumeric('hello')).toBeNull();
  });

  it('returns 0 for empty string', () => {
    expect(sanitizeNumeric('')).toBe(0);
  });

  it('returns null for NaN', () => {
    expect(sanitizeNumeric(NaN)).toBeNull();
    expect(sanitizeNumeric('abc')).toBeNull();
  });

  it('returns number for valid input', () => {
    expect(sanitizeNumeric(42)).toBe(42);
    expect(sanitizeNumeric('42')).toBe(42);
    expect(sanitizeNumeric('3.14')).toBe(3.14);
    expect(sanitizeNumeric(0)).toBe(0);
  });
});

describe('sanitizeDomain', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeDomain(null)).toBe('');
    expect(sanitizeDomain(123)).toBe('');
  });

  it('converts to lowercase', () => {
    expect(sanitizeDomain('EXAMPLE.COM')).toBe('example.com');
    expect(sanitizeDomain('Example.Com')).toBe('example.com');
  });

  it('truncates to 253 chars', () => {
    const long = 'a'.repeat(300) + '.com';
    expect(sanitizeDomain(long).length).toBe(253);
  });

  it('trims whitespace', () => {
    expect(sanitizeDomain('  example.com  ')).toBe('example.com');
  });

  it('removes invalid characters', () => {
    expect(sanitizeDomain('example@.com')).toBe('example.com');
    expect(sanitizeDomain('exam ple.com')).toBe('example.com');
    expect(sanitizeDomain('example.com!')).toBe('example.com');
  });
});

describe('isValidDomain', () => {
  it('returns true for valid domains', () => {
    expect(isValidDomain('example.com')).toBe(true);
    expect(isValidDomain('sub.example.com')).toBe(true);
    expect(isValidDomain('my-site.co.uk')).toBe(true);
  });

  it('returns false for invalid domains', () => {
    expect(isValidDomain('')).toBe(false);
    expect(isValidDomain('localhost')).toBe(false);
    expect(isValidDomain('example')).toBe(false);
    expect(isValidDomain('example.c')).toBe(false);
    expect(isValidDomain('-example.com')).toBe(false);
    expect(isValidDomain('exam*ple.com')).toBe(false);
  });
});
