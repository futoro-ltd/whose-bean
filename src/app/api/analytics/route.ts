import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { eventBus } from '@/lib/event-bus';
import { sanitizeString, sanitizeUrl, sanitizeNumeric } from '@/lib/sanitize';
import { getClientIp, getGeolocation } from '@/lib/geolocation';
import { commsLog } from '@/lib/comms-logger';
import { isBot, getBotHandlingMode } from '@/lib/bot-detection';
import { z } from 'zod';

const analyticsSchema = z.object({
  sessionId: z.string().max(100).optional(),
  page: z.string().max(1000).optional(),
  referrer: z.string().max(2048).optional(),
  userAgent: z.string().max(500).optional(),
  browser: z.string().max(50).optional(),
  os: z.string().max(50).optional(),
  device: z.string().max(20).optional(),
  ip: z.string().max(45).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  screenWidth: z.number().int().min(0).max(10000).optional(),
  screenHeight: z.number().int().min(0).max(10000).optional(),
  language: z.string().max(50).optional(),
  domainId: z.string().min(1).max(100),
});

function corsResponse(data: unknown, status: number = 200, origin?: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...(status !== 204 ? { 'Content-Type': 'application/json' } : {}),
  };

  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  const response = new NextResponse(status === 204 ? null : JSON.stringify(data), {
    status,
    headers,
  });
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return corsResponse({}, 204, origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse({ success: false, error: 'Invalid JSON' }, 400, origin);
    }

    const parsed = analyticsSchema.safeParse(body);

    if (!parsed.success) {
      return corsResponse({ success: false, error: 'Invalid input' }, 400, origin);
    }

    const { domainId, ip: spoofedIp, userAgent } = parsed.data;

    // Bot detection and handling
    const userAgentString = userAgent || request.headers.get('user-agent');
    const botDetected = isBot(userAgentString);
    const botHandlingMode = getBotHandlingMode();

    if (botDetected) {
      // Log bot detection for all modes
      commsLog('Bot detected in analytics request', {
        origin,
        domainId,
        userAgent: userAgentString?.substring(0, 100), // Limit length for logging
        handlingMode: botHandlingMode,
      });

      // Handle based on configuration
      if (botHandlingMode === 'filter') {
        // Filter mode: Don't store bot traffic, but return success to client
        return corsResponse({ success: true, filtered: true }, 200, origin);
      }
      // For 'mark' and 'log' modes, continue processing
    }

    const isDev = process.env.NODE_ENV === 'development';
    const clientIp = isDev && spoofedIp ? spoofedIp : getClientIp(request);
    let country: string | undefined;
    let city: string | undefined;

    // KEEP: COMMS logging - incoming request from external domain
    commsLog('Incoming analytics request', {
      origin,
      domainId,
      page: parsed.data.page,
      clientIpRequest: spoofedIp ? 'spoofedIp' : 'from headers',
      clientIp: clientIp || 'unknown',
    });

    if (clientIp) {
      try {
        const geo = await getGeolocation(clientIp);
        if (geo) {
          country = geo.country;
          city = geo.city;
          commsLog('Geolocation resolved', { clientIp, country, city });
        }
      } catch (error) {
        commsLog('Geolocation failed', { clientIp, error: String(error) });
      }
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      return corsResponse({ success: false, error: 'Invalid domain' }, 400, origin);
    }

    const sanitized = {
      sessionId: parsed.data.sessionId || 'anonymous',
      page: sanitizeString(parsed.data.page) || '/',
      referrer: sanitizeUrl(parsed.data.referrer),
      userAgent: sanitizeString(parsed.data.userAgent),
      browser: sanitizeString(parsed.data.browser),
      os: sanitizeString(parsed.data.os),
      device: sanitizeString(parsed.data.device),
      country: country,
      city: city,
      latitude: sanitizeNumeric(parsed.data.latitude),
      longitude: sanitizeNumeric(parsed.data.longitude),
      screenWidth: sanitizeNumeric(parsed.data.screenWidth),
      screenHeight: sanitizeNumeric(parsed.data.screenHeight),
      language: sanitizeString(parsed.data.language),
      isBot: botDetected && botHandlingMode === 'mark',
    };

    // KEEP: COMMS logging - sanitized analytics data ready for storage
    // Comment this out later
    commsLog('Full sanitized analytics entry', {
      sanitized: sanitized,
    });

    const entry = await prisma.analyticsEntry.create({
      data: {
        sessionId: sanitized.sessionId,
        page: sanitized.page,
        referrer: sanitized.referrer || null,
        userAgent: sanitized.userAgent || null,
        browser: sanitized.browser || null,
        os: sanitized.os || null,
        device: sanitized.device || null,
        country: sanitized.country || null,
        city: sanitized.city || null,
        latitude: sanitized.latitude,
        longitude: sanitized.longitude,
        screenWidth: sanitized.screenWidth,
        screenHeight: sanitized.screenHeight,
        language: sanitized.language || null,
        isBot: sanitized.isBot,
        domainId: domain.id,
      },
    });

    // KEEP: COMMS logging - analytics stored successfully
    commsLog('Analytics entry stored', {
      entryId: entry.id,
      domainId: domain.id,
      page: sanitized.page,
    });

    await prisma.pageView.upsert({
      where: { path_domainId: { path: sanitized.page, domainId: domain.id } },
      update: {
        views: { increment: 1 },
        uniqueViews: parsed.data.sessionId ? { increment: 1 } : undefined,
        lastViewed: new Date(),
      },
      create: {
        path: sanitized.page,
        views: 1,
        uniqueViews: parsed.data.sessionId ? 1 : 0,
        domainId: domain.id,
      },
    });

    // KEEP: COMMS logging - signalling external clients via eventBus
    eventBus.emit(domain.id, { type: 'update', domainId: domain.id });
    commsLog('EventBus emitted for domain', { domainId: domain.id });

    return corsResponse({ success: true, id: entry.id }, 200, origin);
  } catch (error) {
    console.error('Analytics error:', error);
    return corsResponse({ success: false, error: 'Failed to log analytics' }, 500, origin);
  }
}

export async function GET() {
  return corsResponse({ message: 'Analytics API is running' });
}
