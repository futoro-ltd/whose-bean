'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { GradientText } from '@/components/gradient-text';
import LogoutButton from '@/components/logoutButton';
import { Github } from 'lucide-react';

interface AppHeaderProps {
  isLoggedIn: boolean;
}

export function AppHeader({ isLoggedIn }: AppHeaderProps) {
  return (
    <div className="w-full max-w-6xl mx-auto ">
      <header className="flex justify-between items-center py-0">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whose-bean.svg" alt="Whose Bean" className="w-16 h-20" />
          <GradientText className="text-3xl">Whose Bean</GradientText>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/futoro-uk/whose-bean"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <ThemeToggle />
          {isLoggedIn && <LogoutButton />}
        </div>
      </header>
    </div>
  );
}
