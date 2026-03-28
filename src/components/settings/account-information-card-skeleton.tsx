import { StandardCard } from '@/components/standard-card';

export function AccountInformationCardSkeleton() {
  return (
    <StandardCard className="lg:w-1/2">
      {/* Header skeleton */}
      <div className="px-6 py-4 border-b">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-48 animate-pulse" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32 mt-2 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="px-6 py-4 space-y-4">
        <div className="flex md:flex-row gap-4 flex-col">
          {/* Email field skeleton - left half */}
          <div className="md:w-1/2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-12 animate-pulse" />
            <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-full mt-2 animate-pulse" />
          </div>

          {/* Role + Member Since skeleton - right half */}
          <div className="flex md:w-1/2 w-full">
            <div className="w-1/2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-10 animate-pulse" />
              <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-16 mt-2 animate-pulse" />
            </div>
            <div className="w-1/2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20 animate-pulse" />
              <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-24 mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </StandardCard>
  );
}
