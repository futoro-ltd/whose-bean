export interface Domain {
  id: string;
  domain: string;
  createdAt: string;
  userId: string | null;
  user: {
    email: string;
  } | null;
  isPublic: boolean;
  allowedUsers: { id: string; email: string }[];
  _count: { analyticsEntries: number };
}

export interface DomainWithCount {
  id: string;
  domain: string;
  createdAt: Date;
  userId: string | null;
  user: { email: string } | null;
  isPublic: boolean;
  allowedUsers: { id: string; email: string }[];
  _count: { analyticsEntries: number };
}

export type GetDomainsResult =
  | { success: true; domains: DomainWithCount[] }
  | { success: false; error: string };

export type CreateDomainResult =
  | { success: true; domain: { id: string; domain: string; createdAt: Date } }
  | { success: false; error: string };

export type GetDomainResult =
  | { success: true; domain: DomainWithCount }
  | { success: false; error: string };

export type DeleteDomainResult = { success: true } | { success: false; error: string };

export type ToggleDomainVisibilityResult =
  | { success: true; isPublic: boolean }
  | { success: false; error: string };

export interface DomainAccessUser {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface DomainWithAccess {
  id: string;
  domain: string;
  user: { id: string; email: string } | null;
  _count: { allowedUsers: number };
}

export type GetDomainAccessUsersResult =
  | { success: true; users: DomainAccessUser[] }
  | { success: false; error: string };

export type GrantDomainAccessResult = { success: true } | { success: false; error: string };

export type RevokeDomainAccessResult = { success: true } | { success: false; error: string };

export type GetDomainsWithAccessInfoResult =
  | { success: true; domains: DomainWithAccess[] }
  | { success: false; error: string };

export type CheckDomainAnalyticsAccessResult =
  | { success: true; domain: { domain: string; isPublic: boolean } }
  | { success: false; error: string; code: 'NOT_FOUND' | 'FORBIDDEN' };

export interface FilterParams {
  browsers: string[] | null;
  devices: string[] | null;
  operatingSystems: string[] | null;
}

export interface DateRangeResult {
  start: Date;
  end: Date;
  granularity?: string;
}

export interface DomainAccessUserWithDateString {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}
