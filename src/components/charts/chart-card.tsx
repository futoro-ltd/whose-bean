'use client';

import { cn } from '@/lib/utils';
import { StandardCard } from '@/components/standard-card';
import { useChartAnimation } from '@/hooks/use-chart-animation';

interface ChartCardProps {
  title: string;
  icon?: React.ElementType;
  tabList?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay: string;
}

export function ChartCard({
  title,
  icon: Icon,
  tabList,
  children,
  className = '',
  delay,
}: ChartCardProps) {
  const { animationMode, isHighlighting } = useChartAnimation();

  let animationStyle = {};
  if (animationMode === 'stagger') {
    animationStyle = { animation: `fadeInUp 0.6s ${delay} ease-out both` };
  } else if (animationMode === 'highlight' && isHighlighting) {
    animationStyle = { animation: `borderGlow 0.5s ease-out both` };
  }

  return (
    <StandardCard className={cn('relative overflow-hidden', className)} style={animationStyle}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between">
            <div className="flex flex-row items-center gap-4">
              {Icon && (
                <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-indigo-500 to-violet-500">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex gap-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                  {title}
                </h3>
              </div>
            </div>
            {tabList}
          </div>
        </div>
        <div className="h-px mx-6 bg-gradient-to-r from-transparent via-zinc-200/50 dark:via-zinc-700/50 to-transparent" />
        <div className="relative ">{children}</div>
      </div>
    </StandardCard>
  );
}
