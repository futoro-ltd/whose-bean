import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GradientText } from '@/components/gradient-text';
import { MutedSubheader } from './muted-subheader';

interface StandardCardProps extends React.ComponentProps<'div'> {
  title?: string;
  description?: string;
  gradientTitle?: boolean;
  tabs?: React.ReactNode;
}

function StandardCard({
  className,
  title,
  description,
  gradientTitle = true,
  tabs,
  children,
  ...props
}: StandardCardProps) {
  const standardBackground = '';

  if (title || description || tabs) {
    return (
      <Card className={cn(standardBackground, className)} {...props}>
        {tabs ? (
          <div className="relative">
            <div className="flex items-center justify-between gap-4 md:px-6 px-2 md:pt-6">
              <div className="min-w-0">
                {title &&
                  (gradientTitle ? (
                    <h3 className="text-lg font-semibold truncate">
                      <GradientText>{title}</GradientText>
                    </h3>
                  ) : (
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                      {title}
                    </h3>
                  ))}
                {description && <MutedSubheader label={description} />}
              </div>
              {tabs}
            </div>
            <div className="h-px mx-6 bg-gradient-to-r from-transparent via-zinc-200/50 dark:via-zinc-700/50 to-transparent" />
          </div>
        ) : (
          <CardHeader className="md:p-6 p-2">
            {title &&
              (gradientTitle ? (
                <CardTitle>
                  <GradientText>{title}</GradientText>
                </CardTitle>
              ) : (
                <CardTitle>{title}</CardTitle>
              ))}
            {description && <CardDescription className="text-base">{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className="md:p-6 p-2">{children}</CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(standardBackground, className)} {...props}>
      <CardContent className="md:p-6 p-2">{children}</CardContent>
    </Card>
  );
}

export { StandardCard };
