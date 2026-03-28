export function AnalyticsLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <div className="absolute inset-0 m-auto w-6 h-6 flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
