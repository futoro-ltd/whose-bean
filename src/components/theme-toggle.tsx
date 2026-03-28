'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="suppressHydrationWarning flex text-2xl" title="Theme changer">
      <Button
        variant="ghost"
        className="hidden dark:block rounded-2xl backdrop-blur-xl"
        aria-label="Set to light mode"
        onClick={() => setTheme('light')}
      >
        <Sun />
      </Button>
      <Button
        variant="ghost"
        className="block dark:hidden rounded-2xl backdrop-blur-xl"
        aria-label="Set to dark mode"
        onClick={() => setTheme('dark')}
      >
        <Moon />
      </Button>
    </div>
  );
}
