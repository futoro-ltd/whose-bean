import { describe, it, expect, vi } from 'vitest';
import { getClientIp, isPrivateIp } from './geolocation';

vi.mock('next/server', () => ({
  NextRequest: class {
    headers: Map<string, string>;
    constructor(_url: string, _init?: RequestInit) {
      this.headers = new Map();
    }
  },
}));

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for', () => {
    const headers = new Map([['x-forwarded-for', '1.2.3.4, 5.6.7.8']]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = { headers } as any;
    expect(getClientIp(request)).toBe('1.2.3.4');
  });

  it('extracts IP from x-real-ip when x-forwarded-for not present', () => {
    const headers = new Map([['x-real-ip', '9.10.11.12']]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = { headers } as any;
    expect(getClientIp(request)).toBe('9.10.11.12');
  });

  it('extracts IP from cf-connecting-ip', () => {
    const headers = new Map([['cf-connecting-ip', '10.20.30.40']]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = { headers } as any;
    expect(getClientIp(request)).toBe('10.20.30.40');
  });

  it('prefers x-forwarded-for over other headers', () => {
    const headers = new Map([
      ['x-forwarded-for', '1.1.1.1'],
      ['x-real-ip', '2.2.2.2'],
      ['cf-connecting-ip', '3.3.3.3'],
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = { headers } as any;
    expect(getClientIp(request)).toBe('1.1.1.1');
  });

  it('returns null when no headers present', () => {
    const headers = new Map();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request = { headers } as any;

    expect(getClientIp(request)).toBeNull();
  });
});

describe('isPrivateIp', () => {
  it('returns true for localhost', () => {
    expect(isPrivateIp('localhost')).toBe(true);
    expect(isPrivateIp('127.0.0.1')).toBe(true);
    expect(isPrivateIp('127.0.0.2')).toBe(true);
    expect(isPrivateIp('::1')).toBe(true);
  });

  it('returns true for 10.x.x.x private range', () => {
    expect(isPrivateIp('10.0.0.1')).toBe(true);
    expect(isPrivateIp('10.10.10.10')).toBe(true);
    expect(isPrivateIp('10.255.255.255')).toBe(true);
  });

  it('returns true for 172.16-31.x.x private range', () => {
    expect(isPrivateIp('172.16.0.1')).toBe(true);
    expect(isPrivateIp('172.20.50.100')).toBe(true);
    expect(isPrivateIp('172.31.255.255')).toBe(true);
    expect(isPrivateIp('172.15.0.1')).toBe(false);
    expect(isPrivateIp('172.32.0.1')).toBe(false);
  });

  it('returns true for 192.168.x.x private range', () => {
    expect(isPrivateIp('192.168.0.1')).toBe(true);
    expect(isPrivateIp('192.168.100.200')).toBe(true);
    expect(isPrivateIp('192.168.255.255')).toBe(true);
    expect(isPrivateIp('192.169.0.1')).toBe(false);
  });

  it('returns true for link-local 169.254.x.x', () => {
    expect(isPrivateIp('169.254.0.1')).toBe(true);
    expect(isPrivateIp('169.254.100.100')).toBe(true);
  });

  it('returns false for public IPs', () => {
    expect(isPrivateIp('8.8.8.8')).toBe(false);
    expect(isPrivateIp('1.1.1.1')).toBe(false);
    expect(isPrivateIp('93.184.216.34')).toBe(false);
  });

  it('returns true for empty/invalid IPs', () => {
    expect(isPrivateIp('')).toBe(true);
    expect(isPrivateIp('invalid')).toBe(true);
    expect(isPrivateIp('192.168')).toBe(true);
  });
});
