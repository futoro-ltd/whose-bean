import { getCountryNameByISO2 } from '@/data/country-codes';

export function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function formatLocation(country: string | null): string {
  const countryName = country ? getCountryNameByISO2(country) || country : null;
  if (countryName) return countryName;
  return 'Unknown';
}
