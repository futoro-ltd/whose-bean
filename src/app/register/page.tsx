'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { registerUser, checkUsersExist } from '@/app/actions/auth';
import { SingleCentralCard } from '@/components/single-central-card';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkUsers = async () => {
      try {
        const data = await checkUsersExist();
        if (data.hasUsers) {
          router.push('/login');
        }
      } catch {
      } finally {
        setInitialLoading(false);
      }
    };
    checkUsers();
  }, [router]);

  useEffect(() => {
    if (!initialLoading) {
      setLoading(false);
    }
  }, [initialLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await registerUser({ email, password });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
        <div className="animate-pulse text-indigo-600 font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <SingleCentralCard title="Create Account" description="Enter your details to get started">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showStrength
            required
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            loading ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            password !== confirmPassword ||
            password.length < 8
          }
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </SingleCentralCard>
  );
}
