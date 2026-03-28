import { NextRequest } from 'next/server';
import { commsLog } from './comms-logger';

interface GeoCache {
  country: string;
  city: string;
  cachedAt: number;
}

interface CountryResponse {
  city: string;
  country: string;
  ip?: string; // Included if you don't restrict fields
  error?: string; // To handle API-side errors
}

const geoCache = new Map<string, GeoCache>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

function extractIpFromHeaders(request: NextRequest): string | null {
  const xForwarded =
    request.headers.get('x-forwarded-for') || request.headers.get('X-Forwarded-For');
  const realIp = request.headers.get('X-Real-IP') || request.headers.get('x-real-ip');
  const cfConnectingIp =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('cf-Connecting-Ip') ||
    request.headers.get('CF-connecting-ip');

  // KEEP: COMMS logging - incoming request from external domain
  // commsLog('Other Request data', {
  //   headers: request.headers,
  //   referrer: request.referrer,
  //   url: request.url,
  // })

  // KEEP: COMMS logging - incoming request from external domain
  // commsLog('Extract Ip From Headers', {
  //   xForwarded: xForwarded,
  //   forwarded: forwarded,
  //   realIp: realIp,
  //   cfConnectingIp: cfConnectingIp,
  //   remoteAddr: remoteAddr,
  //   clientIp: clientIp,
  //   TrueClientIp: TrueClientIp,
  // })

  if (xForwarded) {
    return xForwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return null;
}

export function getClientIp(request: NextRequest): string | null {
  return extractIpFromHeaders(request);
}

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;

  const parts = ip.split('.');
  if (parts.length !== 4) return true;

  const first = parseInt(parts[0], 10);
  const second = parseInt(parts[1], 10);

  // 127.x.x.x - localhost
  if (first === 127) return true;

  // 10.x.x.x - private
  if (first === 10) return true;

  // 172.16.x.x - 172.31.x.x - private
  if (first === 172 && second >= 16 && second <= 31) return true;

  // 192.168.x.x - private
  if (first === 192 && second === 168) return true;

  // 169.254.x.x - link-local
  if (first === 169 && second === 254) return true;

  // localhost
  if (ip === 'localhost' || ip === '::1') return true;

  return false;
}

export async function getGeolocation(
  ip: string
): Promise<{ country: string; city: string } | null> {
  if (!ip || isPrivateIp(ip)) return null;

  // KEEP: COMMS logging - checking cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    // KEEP: COMMS logging - cache hit
    commsLog('Geolocation cache hit', { ip, country: cached.country, city: cached.city });
    return { country: cached.country, city: cached.city };
  }

  // KEEP: COMMS logging - cache miss, making external API call
  commsLog('Geolocation cache miss, calling external API', { ip, api: 'ip-api.com' });

  for (const [, entry] of geoCache) {
    if (Date.now() - entry.cachedAt >= CACHE_TTL) {
      const keysToDelete: string[] = [];
      for (const [key, val] of geoCache) {
        if (Date.now() - val.cachedAt >= CACHE_TTL) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((key) => geoCache.delete(key));
      break;
    }
  }

  //const url = `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`;
  const url = `https://api.country.is/${ip}?fields=city,country`;

  // KEEP: COMMS logging - external API call
  commsLog('External API call', { url, ip });

  const response = await fetch(url, {
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) throw new Error(`Geolocation API error: ${response.status}`);

  const data: CountryResponse = await response.json();

  if (data.error !== undefined) return null;

  const geo = {
    country: data.country,
    city: data.city,
  };

  geoCache.set(ip, { ...geo, cachedAt: Date.now() });

  // KEEP: COMMS logging - external API response received
  commsLog('Geolocation API response', { ip, country: geo.country, city: geo.city });

  return geo;
}
