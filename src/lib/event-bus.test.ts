import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventBus } from './event-bus';

const GLOBAL_KEY = 'event-bus-listeners';

function clearListeners() {
  const globalMap = globalThis as unknown as Record<string, Map<string, Set<unknown>> | undefined>;
  if (globalMap[GLOBAL_KEY]) {
    globalMap[GLOBAL_KEY]!.clear();
  }
}

describe('eventBus', () => {
  beforeEach(() => {
    clearListeners();
  });

  it('subscribes and unsubscribes', () => {
    const fn = vi.fn();
    const unsubscribe = eventBus.subscribe('test', fn);

    eventBus.emit('test', 'data');
    expect(fn).toHaveBeenCalledWith('data');

    unsubscribe();
    eventBus.emit('test', 'more');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calls multiple listeners', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    eventBus.subscribe('test', fn1);
    eventBus.subscribe('test', fn2);

    eventBus.emit('test', 'data');
    expect(fn1).toHaveBeenCalledWith('data');
    expect(fn2).toHaveBeenCalledWith('data');
  });

  it('handles events independently', () => {
    const fnA = vi.fn();
    const fnB = vi.fn();

    eventBus.subscribe('eventA', fnA);
    eventBus.subscribe('eventB', fnB);

    eventBus.emit('eventA', 'a');
    expect(fnA).toHaveBeenCalledWith('a');
    expect(fnB).not.toHaveBeenCalled();
  });

  it('returns unsubscribe function that handles missing listeners', () => {
    const fn = vi.fn();
    const unsubscribe = eventBus.subscribe('test', fn);

    eventBus.emit('test', 'data');
    expect(fn).toHaveBeenCalledTimes(1);

    unsubscribe();
    unsubscribe(); // should not throw

    eventBus.emit('test', 'more');
    expect(fn).toHaveBeenCalledTimes(1); // fn should not be called after unsubscribe
  });
});
