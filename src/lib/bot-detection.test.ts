import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isBot, getBotHandlingMode } from './bot-detection';

describe('isBot', () => {
  it('returns false for null or undefined', () => {
    expect(isBot(null)).toBe(false);
    expect(isBot(undefined)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isBot('')).toBe(false);
  });

  it('detects common search engine bots', () => {
    const botUserAgents = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
      'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)',
      'Baiduspider+(+http://www.baidu.com/search/spider.htm)',
      'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
      'Twitterbot/1.0',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
      'Pinterestbot/1.0 (+https://help.pinterest.com/en/article/pinterest-bot)',
      'Applebot/0.1; +http://www.apple.com/go/applebot',
    ];

    botUserAgents.forEach((ua) => {
      expect(isBot(ua)).toBe(true);
    });
  });

  it('detects headless browsers', () => {
    const headlessUserAgents = [
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.6099.199 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0 HeadlessFirefox',
      'PhantomJS/2.1.1',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.199 Safari/537.36 Selenium/4.11.2',
    ];

    headlessUserAgents.forEach((ua) => {
      expect(isBot(ua)).toBe(true);
    });
  });

  it('returns false for normal browsers', () => {
    const normalUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.199 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.199 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.199 Safari/537.36 Edg/120.0.0.0',
    ];

    normalUserAgents.forEach((ua) => {
      expect(isBot(ua)).toBe(false);
    });
  });

  it('detects generic bot patterns when no browser signature', () => {
    const genericBotUserAgents = [
      'Mozilla/5.0 (compatible; research bot/1.0)',
      'CustomCrawler/1.0',
      'SpiderBot/2.0',
      'Slurp/1.0',
    ];

    genericBotUserAgents.forEach((ua) => {
      expect(isBot(ua)).toBe(true);
    });
  });

  it('does not detect generic patterns when browser signature present', () => {
    // Browser signature present, so generic pattern should not trigger
    const mixedUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.199 Safari/537.36 (compatible; research bot/1.0)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15 (search engine)',
    ];

    mixedUserAgents.forEach((ua) => {
      expect(isBot(ua)).toBe(false);
    });
  });

  it('is case insensitive', () => {
    expect(isBot('GOOGLEBOT/2.1')).toBe(true);
    expect(isBot('Bingbot')).toBe(true);
    expect(isBot('HeadlessChrome')).toBe(true);
  });
});

describe('getBotHandlingMode', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns "filter" as default', () => {
    delete process.env.ANALYTICS_BOT_HANDLING;
    expect(getBotHandlingMode()).toBe('filter');
  });

  it('returns configured mode', () => {
    process.env.ANALYTICS_BOT_HANDLING = 'mark';
    expect(getBotHandlingMode()).toBe('mark');

    process.env.ANALYTICS_BOT_HANDLING = 'log';
    expect(getBotHandlingMode()).toBe('log');

    process.env.ANALYTICS_BOT_HANDLING = 'filter';
    expect(getBotHandlingMode()).toBe('filter');
  });

  it('defaults to "filter" for invalid values', () => {
    process.env.ANALYTICS_BOT_HANDLING = 'invalid';
    expect(getBotHandlingMode()).toBe('filter');

    process.env.ANALYTICS_BOT_HANDLING = 'FILTER';
    expect(getBotHandlingMode()).toBe('filter');

    process.env.ANALYTICS_BOT_HANDLING = 'MARK';
    expect(getBotHandlingMode()).toBe('mark');
  });

  it('handles case insensitivity', () => {
    process.env.ANALYTICS_BOT_HANDLING = 'MARK';
    expect(getBotHandlingMode()).toBe('mark');

    process.env.ANALYTICS_BOT_HANDLING = 'Log';
    expect(getBotHandlingMode()).toBe('log');
  });
});
