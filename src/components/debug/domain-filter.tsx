'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DomainFilterProps {
  domains: { id: string; domain: string }[];
  selectedDomainId?: string;
}

export function DomainFilter({ domains, selectedDomainId }: DomainFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDomainChange = (domainId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (domainId === 'all') {
      params.delete('domainId');
    } else {
      params.set('domainId', domainId);
    }
    router.push(`/admin/debug-analytics?${params.toString()}`);
  };

  return (
    <div className="flex md:flex-row flex-col md:items-center gap-4">
      <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Filter by Domain</h2>
      <label className="sr-only">Filter by Domain:</label>
      <Select value={selectedDomainId || 'all'} onValueChange={handleDomainChange}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="All Domains" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Domains</SelectItem>
          {domains.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.domain}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
