'use client';

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackDomainProps {
  html: string;
}

export function HtmlCopy({ html }: TrackDomainProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-600">
        <span className="text-xs text-zinc-500 font-medium">HTML</span>
        <Button size="sm" onClick={handleCopy} variant="secondary">
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="p-4 text-sm font-mono overflow-x-auto">{html}</div>
    </div>
  );
}
