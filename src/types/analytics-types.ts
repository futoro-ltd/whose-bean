export interface PageViewEntry {
  id: string;
  timestamp: string;
  page: string;
  browser: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  os: string | null;
}

export interface VisitorEntry {
  sessionId: string;
  firstSeen: string;
  lastSeen: string;
  pageCount: number;
  country: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
}

export interface AnalyticsEntriesResponse {
  entries: PageViewEntry[] | VisitorEntry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnalyticsStreamData {
  domain: string;
  isPublic: boolean;
  totalViews: number;
  uniqueVisitors: number;
  uniquePagesCount: number;
  topPages: { path: string; views: number }[];
  viewsOverTime: { date: string; views: number }[];
  visitorsOverTime: { date: string; visitors: number }[];
  browsers: { browser: string; count: number }[];
  devices: { device: string; count: number }[];
  operatingSystems: { os: string; count: number }[];
  countries: { country: string; count: number }[];
  referrers: { referrer: string; count: number }[];
}

export interface DebugAnalyticsEntry {
  id: string;
  sessionId: string;
  page: string;
  referrer: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  city: string | null;
  timestamp: Date;
  isBot: boolean;
  domain: string;
}

export interface DebugAnalyticsEntriesResult {
  entries: DebugAnalyticsEntry[];
  total: number;
}

export interface DebugDatabaseInfo {
  userCount: number;
  adminCount: number;
  invitationCount: number;
  passwordResetTokenCount: number;
  domainCount: number;
  publicDomainCount: number;
  privateDomainCount: number;
  analyticsEntryCount: number;
  analyticsEntriesLast24h: number;
  analyticsEntriesLast7d: number;
  pageViewCount: number;
  botCount: number;
}

export interface DebugDomainInfo {
  entryCount: number;
  uniqueSessionCount: number;
  botCount: number;
  entriesLast24h: number;
  entriesLast7d: number;
}

export interface SendMockAnalyticsResult {
  success: boolean;
  count: number;
  entries?: MockAnalyticsEntry[];
  error?: string;
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
