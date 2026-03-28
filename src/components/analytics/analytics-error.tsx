export function AnalyticsError({ error }: { error: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-zinc-500 text-lg">Failed to load analytics: {error}</div>
    </div>
  );
}
