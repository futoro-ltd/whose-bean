import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/event-bus';
import { commsLog } from '@/lib/comms-logger';
import { getCurrentUser } from '@/lib/auth';
import { checkDomainAnalyticsAccess } from '@/app/actions/analytics-domain-access';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  const origin = request.headers.get('origin');
  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get('domainId');

  if (!domainId) {
    return new Response('domainId is required', { status: 400 });
  }

  const accessCheck = await checkDomainAnalyticsAccess(domainId, user?.id);

  if (!accessCheck.success) {
    const status = accessCheck.code === 'NOT_FOUND' ? 400 : 403;
    return new Response(accessCheck.error, { status });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // KEEP: COMMS logging - SSE client connected
      commsLog('SSE client connected', { domainId });

      const sendEvent = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          // KEEP: COMMS logging - event sent to SSE client
          commsLog('SSE event sent', { domainId, eventType: (data as { type?: string }).type });
        } catch {
          // Stream closed
        }
      };

      const unsubscribe = eventBus.subscribe(domainId, sendEvent);

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      const close = () => {
        clearInterval(keepAlive);
        unsubscribe();
        // KEEP: COMMS logging - SSE client disconnected
        commsLog('SSE client disconnected', { domainId });
        try {
          controller.close();
        } catch {}
      };

      request.signal.addEventListener('abort', close);
    },
  });

  const headers: Record<string, string> = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };

  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(stream, { headers });
}
