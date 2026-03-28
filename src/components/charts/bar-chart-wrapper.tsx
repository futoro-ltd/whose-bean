import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from './chart-card';
import { useChartTooltipStyle } from '@/lib/chart-tooltip';

interface BarChartWrapperProps<T> {
  name: string;
  axisDataKey: string;
  barDataKey: string;
  stopColor1: string;
  stopColor2: string;
  data: T[];
  layout?: 'horizontal' | 'vertical';
}

export function BarChartWrapper<T>({
  name,
  axisDataKey,
  barDataKey,
  stopColor1,
  stopColor2,
  data,
  layout = 'vertical',
}: BarChartWrapperProps<T>) {
  const tooltipStyle = useChartTooltipStyle();

  const cartesianGrid =
    layout === 'vertical' ? (
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 90%)" horizontal={false} />
    ) : (
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 90%)" vertical={false} />
    );

  const xAxis =
    layout === 'vertical' ? (
      <XAxis
        type="number"
        allowDecimals={false}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }}
        tickFormatter={(value) => value.toString()}
      />
    ) : (
      <XAxis
        type="category"
        dataKey={axisDataKey}
        allowDecimals={false}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }}
      />
    );

  const yAxis =
    layout === 'vertical' ? (
      <YAxis
        type="category"
        dataKey={axisDataKey}
        allowDecimals={false}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }}
        width={100}
      />
    ) : (
      <YAxis
        type="number"
        allowDecimals={false}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }}
        tickFormatter={(value) => value.toString()}
      />
    );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout={layout} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id={`${name}_colorBar`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor={stopColor1} stopOpacity={0.8} />
            <stop offset="95%" stopColor={stopColor2} stopOpacity={1} />
          </linearGradient>
        </defs>
        {cartesianGrid}
        {xAxis}
        {yAxis}
        <Tooltip contentStyle={tooltipStyle.contentStyle} />
        <Bar dataKey={barDataKey} fill={`url(#${name}_colorBar)`} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
