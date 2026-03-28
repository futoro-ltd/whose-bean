'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
}

export default function BackButton({ href }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {href ? (
        <Link href={href}>
          <Button variant="outline" className="gap-1">
            <ArrowLeft />
            <span className="md:flex hidden">Back</span>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" className="gap-1" onClick={handleBack}>
          <ArrowLeft />
          <span className="md:flex hidden">Back</span>
        </Button>
      )}
    </>
  );
}
