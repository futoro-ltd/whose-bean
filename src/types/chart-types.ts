export interface TopCountriesData {
  country: string;
  count: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<string, string> });
};

export type Metric = 'views' | 'visitors';

export type StatDataName = 'totalViews' | 'uniqueVisitors' | 'uniquePagesCount';
