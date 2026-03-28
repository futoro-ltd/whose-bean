'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDomainsQuery } from '@/hooks/use-domains-query';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { useAlerts } from '@/hooks/use-alerts';

export function AddDomainForm() {
  const [newDomain, setNewDomain] = useState('');
  const [localError, setLocalError] = useState('');
  const { createDomain, isCreating } = useDomainsQuery();
  const { isAdmin } = useAuthQuery();
  const { setSuccess } = useAlerts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await createDomain({ domain: newDomain });
      setNewDomain('');
      setSuccess(`Domain "${newDomain}" added successfully!`);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Failed to create domain');
    }
  };

  if (!isAdmin) return null;

  return (
    <StandardCard title="Add New Domain" className="">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-full">
          <Label htmlFor="newDomain" className="sr-only">
            Domain
          </Label>
          <Input
            id="newDomain"
            type="text"
            placeholder="example.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isCreating || !newDomain.trim()} className="text-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          <span className="md:flex hidden">Add Domain</span>
        </Button>
      </form>
      {localError && <p className="text-red-500 text-sm mt-2">{localError}</p>}
    </StandardCard>
  );
}
