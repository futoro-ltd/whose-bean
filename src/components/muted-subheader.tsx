import { cn } from '@/lib/utils';

interface MutedSubheaderProps {
  label: string;
  className?: string;
}

export function MutedSubheader({ label, className }: MutedSubheaderProps) {
  return <p className={cn('text-muted-foreground text-base', className)}>{label}</p>;
}
