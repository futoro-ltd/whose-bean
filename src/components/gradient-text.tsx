import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({
  children,
  className = 'md:text-3xl text-xl font-bold',
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600',
        'bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}
