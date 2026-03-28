/**
 * Bot detection utility for identifying search engine crawlers and bots
 */

// Common search engine bot patterns
const BOT_PATTERNS = [
  'bot',
  'crawler',
  'spider',
  'slurp', // Yahoo
  'search',
  'fetch',
  'archive',
  'curl',
  'wget',
  'python',
  'java',
  'php',
  'go-http-client',
  'node',
  'scrapy',
  'phantomjs',
  'headless',
];

// Known search engine bot user agents (more specific patterns)
const KNOWN_BOT_PATTERNS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'baiduspider',
  'yahoo',
  'slurp',
  'msnbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'pinterestbot',
  'applebot',
  'semrushbot',
  'ahrefsbot',
  'dotbot',
  'exabot',
  'ia_archiver', // Alexa
  'ia_bot',
  'rogerbot', // Moz
  'siteimprove',
];

/**
 * Detects if a User-Agent string belongs to a bot or crawler
 * @param userAgent - The User-Agent string from the request headers
 * @returns true if the User-Agent indicates a bot, false otherwise
 */
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || typeof userAgent !== 'string') {
    return false;
  }

  const ua = userAgent.toLowerCase();

  // Check known bot patterns first (more specific)
  for (const pattern of KNOWN_BOT_PATTERNS) {
    if (ua.includes(pattern.toLowerCase())) {
      return true;
    }
  }

  // Check generic bot patterns (exclude if it looks like a real browser)
  // First check if it contains a real browser signature
  const hasBrowserSignature =
    ua.includes('chrome/') ||
    ua.includes('firefox/') ||
    ua.includes('safari/') ||
    ua.includes('edge/') ||
    ua.includes('opera/') ||
    ua.includes('webkit/');

  if (!hasBrowserSignature) {
    // Only check generic patterns if no browser signature is present
    for (const pattern of BOT_PATTERNS) {
      if (ua.includes(pattern.toLowerCase())) {
        return true;
      }
    }
  }

  // Check for headless browsers (common automation tools)
  const headlessPatterns = [
    'headlesschrome',
    'headlessfirefox',
    'headless',
    'phantomjs',
    'selenium',
    'webdriver',
    'puppeteer',
    'playwright',
  ];

  for (const pattern of headlessPatterns) {
    if (ua.includes(pattern.toLowerCase())) {
      return true;
    }
  }

  return false;
}

/**
 * Configuration for bot handling in analytics
 */
export type BotHandlingMode = 'filter' | 'mark' | 'log';

/**
 * Gets the bot handling mode from environment variable
 * @returns The configured bot handling mode, defaults to 'filter'
 */
export function getBotHandlingMode(): BotHandlingMode {
  const mode = process.env.ANALYTICS_BOT_HANDLING?.toLowerCase();

  if (mode === 'mark' || mode === 'log') {
    return mode;
  }

  // Default to 'filter'
  return 'filter';
}
