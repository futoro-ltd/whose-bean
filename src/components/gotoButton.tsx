import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  label: string | React.JSX.Element;
  href: string;
  icon?: React.ElementType;
}

export default function GotoButton({ label, href, icon: Icon = ArrowRight }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="outline" className="gap-1">
        <Icon />
        {typeof label === 'string' ? <span className="md:flex hidden">{label}</span> : <>{label}</>}
      </Button>
    </Link>
  );
}
