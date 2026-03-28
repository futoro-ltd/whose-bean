import { useReferrersData } from '@/hooks/use-analytics-data';
import { BarChartWrapper } from './bar-chart-wrapper';
import { Link2 } from 'lucide-react';
import { ChartCard } from './chart-card';

interface ReferrersChartProps {
  delay: string;
}

function formatReferrer(referrer: string): string {
  if (!referrer || referrer === 'Direct') return 'Direct';

  try {
    const url = new URL(referrer);
    let hostname = url.hostname.replace(/^www\./, '').replace(/\.com/, '');
    hostname = hostname.length > 20 ? hostname.slice(0, 20) + '...' : hostname;
    return hostname;
  } catch {
    return referrer.length > 20 ? referrer.slice(0, 20) + '...' : referrer;
  }
}

export function ReferrersChart({ delay }: ReferrersChartProps) {
  const data = useReferrersData();

  const formattedData = data.map((d) => ({
    referrer: formatReferrer(d.referrer),
    count: d.count,
  }));

  return (
    <ChartCard title="Referrers" icon={Link2} delay={delay}>
      <BarChartWrapper
        name="referrersBarChart"
        axisDataKey="referrer"
        barDataKey="count"
        stopColor1="hsl(30 80% 55%)"
        stopColor2="hsl(30 80% 55%)"
        data={formattedData}
      />
    </ChartCard>
  );
}
