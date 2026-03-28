'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, Eye, Users } from 'lucide-react';
import { ChartCard } from './chart-card';
import { useChartTooltipStyle } from '@/lib/chart-tooltip';
import { useAnalyticsFilterStore } from '@/stores/analytics-filter-store';
import { useState } from 'react';
import { getXAxisInterval, Period } from '@/data/period-options';
import { useViewsOverTimeData, useVisitorsOverTimeData } from '@/hooks/use-analytics-data';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { MutedSubheader } from '../muted-subheader';

const SHORT_PERIODS: Period[] = [
  'today',
  'yesterday',
  'lastHour',
  'last6hours',
  'last12hours',
  'last24hours',
];

interface ActivityOverTimeChartProps {
  delay: string;
}

export function ActivityOverTimeChart({ delay }: ActivityOverTimeChartProps) {
  const [tab, setTab] = useState<string>('views');

  const { period } = useAnalyticsFilterStore();
  const tooltipStyle = useChartTooltipStyle();
  const data = useViewsOverTimeData();
  const visitorsData = useVisitorsOverTimeData();

  const chartData = tab === 'views' ? data : visitorsData;
  const gradientId = tab === 'views' ? 'colorViews' : 'colorVisitors';
  const strokeColor = tab === 'views' ? 'hsl(220 98% 61%)' : 'hsl(280 85% 65%)';
  const tooltipLabel = tab === 'views' ? 'Page Views' : 'Visitors';

  const showTimeOnly = SHORT_PERIODS.includes(period);
  const xAxisInterval = getXAxisInterval(period);

  const sampledData = chartData;

  const formatXAxis = (dateStr: string) => {
    if (showTimeOnly && dateStr.includes(' ')) {
      const timePart = dateStr.split(' ')[1];
      return timePart;
    }

    if (!dateStr.includes(' ')) {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return dateStr;
  };

  const tabList = (
    <TabsList>
      <TabsTrigger value="views" className="gap-2">
        <Eye />
        <span className="md:flex hidden">Page Views</span>
      </TabsTrigger>
      <TabsTrigger value="visitors" className="gap-2">
        <Users />
        <span className="md:flex hidden">Visitors</span>
      </TabsTrigger>
    </TabsList>
  );

  const headerText = tab === 'views' ? 'Page views over time' : 'Visitors over time';

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <ChartCard title="Activity Over Time" icon={Activity} delay={delay} tabList={tabList}>
        <div className="flex flex-col space-y-4">
          <MutedSubheader label={headerText} />
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={sampledData} margin={{ top: 10, right: -20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220 98% 61%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(220 98% 61%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280 85% 65%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(280 85% 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 90%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'hsl(240 5% 45%)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatXAxis}
                interval={xAxisInterval}
              />
              <YAxis
                orientation="right"
                tick={{ fontSize: 12, fill: 'hsl(240 5% 45%)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toString()}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle.contentStyle}
                formatter={(value: number) => [value, tooltipLabel]}
              />
              <Area
                type="monotone"
                dataKey={tab === 'views' ? 'views' : 'visitors'}
                stroke={strokeColor}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </Tabs>
  );
}
