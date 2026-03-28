'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginUser, checkUsersExist } from '@/app/actions/auth';
import { SingleCentralCard } from '../single-central-card';

export function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  useEffect(() => {
    const checkAndRedirect = async () => {
      const result = await checkUsersExist();
      if (!result.hasUsers) {
        router.push('/register');
      }
    };
    checkAndRedirect();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginUser({ email, password });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <SingleCentralCard title="Sign In" description="Enter your credentials to access your account">
      {reason === 'deleted' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your account was deleted. Please contact an administrator if you believe this is an
            error.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 pointer-events-auto">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={false}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={false}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </div>
      </form>
    </SingleCentralCard>
  );
}
