'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { StandardCard } from '@/components/standard-card';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { requestPasswordReset } from '@/app/actions/password';
import { SingleCentralCard } from '@/components/single-central-card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await requestPasswordReset({ email });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-md md:px-8 px-2">
          <StandardCard
            title="Check Your Email"
            description="We sent a password reset link if an account with that email exists"
          >
            <p className="text-gray-500 mb-4">
              If you don&apos;t receive an email, check your spam folder or make sure you entered
              the correct address.
            </p>
            <div className="flex justify-center">
              <Link href="/login">
                <Button variant="outline">Back to Login</Button>
              </Link>
            </div>
          </StandardCard>
        </div>
      </div>
    );
  }

  return (
    <SingleCentralCard
      title="Forgot Password"
      description="Enter your email to receive a password reset link"
    >
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
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
          Back to login
        </Link>
      </div>
    </SingleCentralCard>
  );
}
