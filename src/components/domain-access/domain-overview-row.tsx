import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

interface DomainOverviewRowProps {
  domain: {
    id: string;
    domain: string;
    user?: { email: string } | null;
    _count: {
      allowedUsers: number;
    };
  };
}

export function DomainOverviewRow({ domain }: DomainOverviewRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{domain.domain}</TableCell>
      <TableCell className="text-zinc-500 dark:text-zinc-400">
        {domain.user?.email || '-'}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
          {domain._count.allowedUsers} <span className="md:flex hidden">user</span>
          {domain._count.allowedUsers !== 1 ? 's' : ''}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <Link href={`/dashboard/${domain.id}`}>
          <Button variant="outline" className="gap-1">
            <ExternalLink />
            <span className="md:flex hidden">Manage</span>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
