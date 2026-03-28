import { useBrowsersData } from '@/hooks/use-analytics-data';
import { PieChartCard } from './pie-chart-card';
import { Globe } from 'lucide-react';

interface BrowsersChartProps {
  delay: string;
}

export function BrowsersChart({ delay }: BrowsersChartProps) {
  const data = useBrowsersData();

  return <PieChartCard title="Browsers" icon={Globe} nameKey="browser" data={data} delay={delay} />;
}
