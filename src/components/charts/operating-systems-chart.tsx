import { useOperatingSystemsData } from '@/hooks/use-analytics-data';
import { PieChartCard } from './pie-chart-card';
import { Monitor } from 'lucide-react';

interface OperatingSystemsChartProps {
  delay: string;
}

export function OperatingSystemsChart({ delay }: OperatingSystemsChartProps) {
  const data = useOperatingSystemsData();

  return <PieChartCard title="Operating Systems" icon={Monitor} nameKey="os" data={data} delay={delay} />;
}
