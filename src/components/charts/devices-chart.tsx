import { useDevicesData } from '@/hooks/use-analytics-data';
import { PieChartCard } from './pie-chart-card';
import { Smartphone } from 'lucide-react';

interface DevicesChartProps {
  delay: string;
}

export function DevicesChart({ delay }: DevicesChartProps) {
  const data = useDevicesData();

  return (
    <PieChartCard title="Devices" icon={Smartphone} nameKey="device" data={data} delay={delay} />
  );
}
