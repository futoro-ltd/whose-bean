import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/app-header';
import { Alerts } from '@/components/alerts';
import { PoweredByFutoro } from '@/components/futoroAssets';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/query-provider';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Whose Bean - Analytics',
  description: 'Web analytics dashboard',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen flex flex-col bg-background dark:bg-background')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AppHeader isLoggedIn={isLoggedIn} />
            <main className="flex-1 w-full max-w-full p-2 md:p-8">
              <Alerts />
              <>{children}</>
            </main>
            <div className="w-full max-w-6xl mx-auto px-6">
              <footer className="py-6 text-center text-zinc-500 dark:text-zinc-400">
                <PoweredByFutoro />
              </footer>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
