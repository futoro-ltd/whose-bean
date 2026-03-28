import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, LegendProps } from 'recharts';
import { Smartphone } from 'lucide-react';
import { ChartCard } from './chart-card';
import { useChartTooltipStyle } from '@/lib/chart-tooltip';

interface Basic {
  count: number;
}

const COLORS = [
  'hsl(220 98% 61%)',
  'hsl(160 60% 45%)',
  'hsl(30 80% 55%)',
  'hsl(280 65% 60%)',
  'hsl(340 75% 55%)',
];

interface CustomLegendProps extends LegendProps {
  sum: number;
}

function CustomLegend({ payload, sum }: CustomLegendProps) {
  return (
    <div className="h-32">
      <div className="grid grid-cols-2 gap-2">
        {payload?.map((entry, index) => {
          const rawValue = entry.payload?.value || 0;
          const percent = (rawValue / sum) * 100;
          const countData = `${rawValue} (${percent.toFixed(1)}%)`;

          return (
            <div key={`legend-item-${index}`} className="flex flex-col gap-2 h-min">
              <div className="flex flex-row space-x-2">
                <div
                  className="flex w-4"
                  style={{
                    backgroundColor: entry.color,
                    borderRadius: entry.type === 'line' ? '50%' : '2px',
                  }}
                />
                <div className="flex flex-col">
                  <span>{entry.value}</span>
                  <span>{countData}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTotal(data: Basic[]) {
  const sum = data.reduce((acc, curr) => acc + curr.count, 0);
  return sum;
}

interface PieChartCardProps<T extends Basic> {
  title: string;
  icon: React.ElementType;
  nameKey: string;
  data: T[];
  delay: string;
}

export function PieChartCard<T extends Basic>({
  title,
  icon,
  nameKey,
  data,
  delay,
}: PieChartCardProps<T>) {
  const tooltipStyle = useChartTooltipStyle();

  const sum = getTotal(data);

  return (
    <ChartCard title={title} icon={icon} delay={delay}>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[(index + 1) % COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle.contentStyle}
            itemStyle={tooltipStyle.itemStyle}
            labelStyle={tooltipStyle.labelStyle}
          />
          <Legend content={<CustomLegend sum={sum} />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
