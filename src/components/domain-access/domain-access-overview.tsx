'use client';

import { useQuery } from '@tanstack/react-query';
import { CardContent } from '@/components/ui/card';
import { StandardCard } from '@/components/standard-card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDomainsWithAccessInfo } from '@/app/actions/domain-access';
import { DomainOverviewRow } from './domain-overview-row';
import { MutedSubheader } from '../muted-subheader';

export function DomainAccessOverview() {
  const { data: domains = [], isLoading: loading } = useQuery({
    queryKey: ['domain-access', 'all'],
    queryFn: async () => {
      const result = await getDomainsWithAccessInfo();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.domains;
    },
  });

  return (
    <StandardCard
      title="Domain Access"
      description="Overview of all domains and how many users have access"
    >
      <div className="pt-4">
        {loading ? (
          <div className="text-center py-8 text-zinc-500">Loading domains...</div>
        ) : domains.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">No domains found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <MutedSubheader label="Domain" />
                </TableHead>
                <TableHead>
                  <MutedSubheader label="Owner" />
                </TableHead>
                <TableHead>
                  <MutedSubheader label="Users with Access" />
                </TableHead>
                <TableHead className="text-right">
                  <MutedSubheader label="Actions" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <DomainOverviewRow key={domain.id} domain={domain} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </StandardCard>
  );
}
