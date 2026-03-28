import { commsLog } from './comms-logger';

type Listener = (data: unknown) => void;

const GLOBAL_KEY = 'event-bus-listeners';

function getListeners(): Map<string, Set<Listener>> {
  const globalMap = globalThis as unknown as Record<string, Map<string, Set<Listener>> | undefined>;
  if (!globalMap[GLOBAL_KEY]) {
    globalMap[GLOBAL_KEY] = new Map();
  }
  return globalMap[GLOBAL_KEY]!;
}

class EventBus {
  subscribe(event: string, listener: Listener): () => void {
    const map = getListeners();
    if (!map.has(event)) {
      map.set(event, new Set());
    }
    map.get(event)!.add(listener);

    // KEEP: COMMS logging - listener subscribed
    commsLog('Listener subscribed', { event });

    return () => {
      map.get(event)?.delete(listener);
      // KEEP: COMMS logging - listener unsubscribed
      commsLog('Listener unsubscribed', { event });
    };
  }

  emit(event: string, data: unknown): void {
    const map = getListeners();
    const eventListeners = map.get(event);
    if (eventListeners) {
      // KEEP: COMMS logging - emitting to listeners
      commsLog('Emitting to listeners', { event, listenerCount: eventListeners.size });
      eventListeners.forEach((listener) => listener(data));
    }
  }
}

export const eventBus = new EventBus();
