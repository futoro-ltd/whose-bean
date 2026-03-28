import { useTopPagesData } from '@/hooks/use-analytics-data';
import { BarChartWrapper } from './bar-chart-wrapper';
import { FileText } from 'lucide-react';
import { ChartCard } from './chart-card';

interface TopPagesChartProps {
  delay: string;
}

export function TopPagesChart({ delay }: TopPagesChartProps) {
  const data = useTopPagesData();

  return (
    <ChartCard title="Top Pages" icon={FileText} delay={delay}>
      <BarChartWrapper
        name="topPagesBarChart"
        axisDataKey="path"
        barDataKey="views"
        stopColor1="hsl(160 60% 45%)"
        stopColor2="hsl(160 60% 45%)"
        data={data}
      />
    </ChartCard>
  );
}
