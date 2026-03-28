export function LoginPageContentSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded mb-2 w-1/2 animate-pulse" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded mb-6 w-3/4 animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
