import { GradientText } from '@/components/gradient-text';
import BackButton from '@/components/backButton';
import { MutedSubheader } from './muted-subheader';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string | undefined;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, backHref, children }: PageHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          <GradientText>{title}</GradientText>
        </div>
        <div className="flex items-center gap-2">
          {children} {backHref && <BackButton href={backHref} />}
        </div>
      </div>
      {description && <MutedSubheader label={description} />}
    </div>
  );
}
