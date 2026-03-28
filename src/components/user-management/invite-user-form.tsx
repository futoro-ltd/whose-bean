'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAdminQuery } from '@/hooks/use-admin-query';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { useAlerts } from '@/hooks/use-alerts';
import { MutedSubheader } from '../muted-subheader';

export function InviteUserForm() {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { inviteUser, isInviting } = useAdminQuery();
  const { isAdmin: isCurrentUserAdmin } = useAuthQuery();
  const { setSuccess, setError } = useAlerts();

  const isEmailValid = email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await inviteUser({ email, isAdmin });
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      setIsAdmin(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send invitation');
    }
  };

  if (!isCurrentUserAdmin) return null;

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Invite a user by email to access this site" />
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="isAdmin"
            checked={isAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
          />
          <Label htmlFor="isAdmin" className="text-sm text-zinc-700 dark:text-zinc-300">
            Make this user an admin
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isInviting || !isEmailValid}>
          {isInviting ? 'Sending invitation...' : 'Send Invitation'}
        </Button>
      </form>
    </div>
  );
}
