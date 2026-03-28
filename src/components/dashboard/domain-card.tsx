'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeleteDomainModal } from '@/hooks/use-delete-domain-modal';
import { GradientText } from '@/components/gradient-text';
import { DeleteButton } from '../user-management/delete-button';
import GotoButton from '../gotoButton';

interface Domain {
  id: string;
  domain: string;
  createdAt: string;
  userId: string | null;
  user: {
    email: string;
  } | null;
  allowedUsers: { id: string; email: string }[];
  _count: { analyticsEntries: number };
}

interface DomainCardProps {
  domain: Domain;
  isAdmin: boolean;
}

export function DomainCard({ domain, isAdmin }: DomainCardProps) {
  const { openDeleteDomainModal } = useDeleteDomainModal();

  return (
    <StandardCard>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <GotoButton
              label={<GradientText>{domain.domain}</GradientText>}
              href={`/dashboard/${domain.id}`}
              icon={ExternalLink}
            />
            <Badge variant="secondary" className="text-nowrap">
              {domain._count.analyticsEntries.toLocaleString()} events
            </Badge>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            ID:{' '}
            <code className="bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded">{domain.id}</code>
          </p>
          <p className=" text-zinc-400">Added: {new Date(domain.createdAt).toLocaleDateString()}</p>
          {domain.user && <p className="text-zinc-400 mt-0.5">By: {domain.user.email}</p>}
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <DeleteButton
              permissionMessages={{
                allowedMessage: 'Delete domain',
                disallowedMessage: 'Cannot delete domain',
              }}
              disabled={false}
              onDelete={() => openDeleteDomainModal(domain.id, domain.domain)}
            />
          )}
        </div>
      </div>
    </StandardCard>
  );
}
