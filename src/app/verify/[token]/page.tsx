'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { verifyToken, verifyUser } from '@/app/actions/verify';
import { SingleCentralCard } from '@/components/single-central-card';

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const result = await verifyToken(token);
      if (result.valid) {
        setValidToken(true);
      } else {
        setError(result.error || 'Invalid or expired invitation');
      }
      setVerifying(false);
    };

    if (token) {
      checkToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await verifyUser({ token, password });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/login');
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-indigo-600 font-medium">Verifying invitation...</div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <SingleCentralCard title="Invalid Invitation" description={error}>
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>
      </SingleCentralCard>
    );
  }

  return (
    <SingleCentralCard
      title="Set Your Password"
      description="Create a password to complete your account"
    >
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            showStrength
            required
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            loading ||
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
