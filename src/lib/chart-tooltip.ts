'use client';

import { useTheme } from 'next-themes';

export function useChartTooltipStyle() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const textColor = isDark ? '#fafafa' : '#18181b';

  return {
    contentStyle: {
      background: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255,255,255,0.95)',
      color: textColor,
      border: 'none',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    itemStyle: { color: textColor },
    labelStyle: { color: textColor },
  };
}
