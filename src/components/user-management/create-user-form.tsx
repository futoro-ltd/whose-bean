'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAdminQuery } from '@/hooks/use-admin-query';
import { useAuthQuery } from '@/hooks/use-auth-query';
import { useAlerts } from '@/hooks/use-alerts';
import { MutedSubheader } from '../muted-subheader';

export function CreateUserForm() {
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirmPassword, setCreateConfirmPassword] = useState('');
  const [createIsAdmin, setCreateIsAdmin] = useState(false);

  const { createUser, isCreatingUser } = useAdminQuery();
  const { isAdmin: isCurrentUserAdmin } = useAuthQuery();
  const { setSuccess, setError } = useAlerts();

  const isFormValid =
    createEmail.includes('@') &&
    createPassword.length >= 8 &&
    createPassword === createConfirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createPassword !== createConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (createPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await createUser({
        email: createEmail,
        password: createPassword,
        isAdmin: createIsAdmin,
      });
      setSuccess(`User ${createEmail} created successfully`);
      setCreateEmail('');
      setCreatePassword('');
      setCreateConfirmPassword('');
      setCreateIsAdmin(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  if (!isCurrentUserAdmin) return null;

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Create a new user to access this site" />
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div className="space-y-2">
          <Label htmlFor="createEmail">Email Address</Label>
          <Input
            id="createEmail"
            type="email"
            placeholder="user@example.com"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createPassword">Password</Label>
          <PasswordInput
            id="createPassword"
            placeholder="Minimum 8 characters"
            value={createPassword}
            onChange={(e) => setCreatePassword(e.target.value)}
            showStrength
            required
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="createConfirmPassword">Confirm Password</Label>
          <PasswordInput
            id="createConfirmPassword"
            placeholder="Re-enter password"
            value={createConfirmPassword}
            onChange={(e) => setCreateConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="createIsAdmin"
            checked={createIsAdmin}
            onCheckedChange={(checked) => setCreateIsAdmin(checked as boolean)}
          />
          <Label htmlFor="createIsAdmin" className="text-sm text-zinc-700 dark:text-zinc-300">
            Make this user an admin
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isCreatingUser || !isFormValid}>
          {isCreatingUser ? 'Creating user...' : 'Create User'}
        </Button>
      </form>
    </div>
  );
}
