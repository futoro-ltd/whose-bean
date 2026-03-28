export function TableLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12 min-h-[400px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-xl opacity-20 animate-pulse" />
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
