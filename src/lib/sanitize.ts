export function sanitizeString(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).trim();
}

export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.slice(0, 2048).trim();
  try {
    const url = new URL(trimmed, 'http://localhost');
    return url.href;
  } catch {
    return trimmed;
  }
}

export function sanitizeUUID(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input) ? input.toLowerCase() : null;
}

export function sanitizeNumeric(input: unknown): number | null {
  const num = Number(input);
  return isNaN(num) ? null : num;
}

export function sanitizeDomain(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .toLowerCase()
    .slice(0, 253)
    .trim()
    .replace(/[^a-z0-9.-]/g, '');
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
  return domainRegex.test(domain);
}
