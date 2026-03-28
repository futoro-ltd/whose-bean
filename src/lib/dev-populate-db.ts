const SAMPLE_COUNTRIES_AND_IPS: { [key: string]: string } = {
  China: '101.101.102.0',
  France: '102.129.135.0',
  Germany: '101.33.10.0',
  India: '101.2.195.0',
  Japan: '1.178.64.0',
  SaudiArabia: '101.46.144.0',
  Spain: '102.177.191.0',
  UnitedStates: '1.178.86.0',
  Serbia: '100.43.64.0',
};

const SAMPLE_OS = ['Windows', 'Linux', 'macOS', 'Android', 'iOS'];

const SAMPLE_BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

const SAMPLE_DEVICES = ['Desktop', 'Mobile', 'Tablet'];

const SAMPLE_PAGES = ['/', '/about', '/products', '/contact', '/blog', '/pricing', '/docs'];

const SAMPLE_REFERRERS = [
  'https://google.com',
  'https://twitter.com',
  'https://facebook.com',
  'https://linkedin.com',
  'https://github.com',
  null,
];

function generateRandomSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface MockAnalyticsEntry {
  sessionId: string;
  page: string;
  referrer: string | null;
  browser: string;
  os: string;
  device: string;
  ip: string;
  country: string;
  domainId: string;
}

export function generateMockAnalyticsEntry(domainId: string): MockAnalyticsEntry {
  const [country, ip] = pickRandom(Object.entries(SAMPLE_COUNTRIES_AND_IPS)) as [string, string];

  return {
    sessionId: generateRandomSessionId(),
    page: pickRandom(SAMPLE_PAGES),
    referrer: pickRandom(SAMPLE_REFERRERS),
    browser: pickRandom(SAMPLE_BROWSERS),
    os: pickRandom(SAMPLE_OS),
    device: pickRandom(SAMPLE_DEVICES),
    ip,
    country,
    domainId,
  };
}

export function generateMultipleMockAnalyticsEntries(
  domainId: string,
  count: number
): MockAnalyticsEntry[] {
  return Array.from({ length: count }, () => generateMockAnalyticsEntry(domainId));
}
