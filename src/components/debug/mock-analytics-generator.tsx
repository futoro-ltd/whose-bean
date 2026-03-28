'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendMockAnalytics } from '@/app/actions/send-mock-analytics';
import { Button } from '@/components/ui/button';
import { MutedSubheader } from '../muted-subheader';

interface MockAnalyticsGeneratorProps {
  selectedDomainId?: string;
}

export function MockAnalyticsGenerator({ selectedDomainId }: MockAnalyticsGeneratorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSendMockData(count: number) {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await sendMockAnalytics(selectedDomainId, count);

      if (response.success) {
        setResult({
          success: true,
          message: `Successfully sent ${response.count} mock analytics entries`,
        });
        router.refresh();
      } else {
        setResult({ success: false, message: response.error || 'Failed to send mock analytics' });
      }
    } catch (e) {
      setResult({ success: false, message: e instanceof Error ? e.message : 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
        Mock Analytics Generator
      </h2>
      <MutedSubheader label="Generate random analytics entries for the selected domain" />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => handleSendMockData(1)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 1
        </Button>
        <Button
          onClick={() => handleSendMockData(5)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 5
        </Button>
        <Button
          onClick={() => handleSendMockData(10)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 10
        </Button>
        <Button
          onClick={() => handleSendMockData(50)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 50
        </Button>
        <Button
          onClick={() => handleSendMockData(100)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 100
        </Button>
        <Button
          onClick={() => handleSendMockData(500)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Send 500
        </Button>
      </div>
      {result && (
        <p
          className={`text-sm ${
            result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
