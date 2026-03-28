'use client';

import { useState } from 'react';
import { Globe, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleDomainVisibility } from '@/app/actions/domains';
import { ButtonGroup } from '../ui/button-group';

interface DomainVisibilityToggleProps {
  domainId: string;
  isPublic: boolean;
  isAdmin: boolean;
  onToggle: (newIsPublic: boolean) => void;
}

export function DomainVisibilityToggle({
  domainId,
  isPublic,
  isAdmin,
  onToggle,
}: DomainVisibilityToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const result = await toggleDomainVisibility(domainId);
    if (result.success) {
      onToggle(result.isPublic);
    }
    setLoading(false);
  };

  const badgeClassName = `inline-flex w-24 items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
    isPublic
      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
  }`;

  const span = (
    <span className={badgeClassName}>
      {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
      {isPublic ? 'Public' : 'Private'}
    </span>
  );

  return (
    <div className="flex items-center gap-2">
      {isAdmin ? (
        <ButtonGroup>
          {span}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={loading}
            className=" w-24 rounded-full gap-1 text-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublic ? (
              <>
                <span>Make Private</span>
              </>
            ) : (
              <>
                <span>Make Public</span>
              </>
            )}
          </Button>
        </ButtonGroup>
      ) : (
        <>{span}</>
      )}
    </div>
  );
}
