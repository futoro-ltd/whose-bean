interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col border border-zinc-200 dark:border-zinc-700">
      <span className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
      {sublabel && <span className="text-xs text-zinc-500 dark:text-zinc-500">{sublabel}</span>}
    </div>
  );
}
