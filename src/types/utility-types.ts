export interface GeoCache {
  country: string;
  city: string;
  cachedAt: number;
}

export interface CountryResponse {
  city: string;
  country: string;
  ip?: string;
  error?: string;
}

export type BotHandlingMode = 'filter' | 'mark' | 'log';

export type Listener = (data: unknown) => void;
