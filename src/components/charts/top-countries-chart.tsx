'use client';

import { useCountriesData } from '@/hooks/use-analytics-data';
import { getCountryNameByISO2 } from '@/data/country-codes';
import { BarChartWrapper } from './bar-chart-wrapper';
import { MutedSubheader } from '../muted-subheader';

export function TopCountriesChart() {
  const data = useCountriesData();

  const normalizedData = data.map((d) => ({
    ...d,
    country: getCountryNameByISO2(d.country) || d.country,
  }));

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Bar chart of visiting countries" />
      <BarChartWrapper
        name="topCountriesBarChart"
        axisDataKey="country"
        barDataKey="count"
        stopColor1="hsl(280 65% 60%)"
        stopColor2="hsl(280 65% 60%)"
        data={normalizedData}
        layout="horizontal"
      />
    </div>
  );
}
