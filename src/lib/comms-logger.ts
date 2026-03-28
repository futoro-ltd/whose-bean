export function commsLog(message: string, data?: unknown): void {
  // KEEP: COMMS logging - used for analytics and external domain signalling
  console.debug(`[COMMS] ${new Date().toISOString()} ${message}`, data ?? '');
}
