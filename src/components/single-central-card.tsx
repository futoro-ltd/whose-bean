import { StandardCard } from '@/components/standard-card';

interface SingleCentralCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function SingleCentralCard({ title, description, children }: SingleCentralCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md md:px-8 mx-2">
        <StandardCard title={title} description={description}>
          {children}
        </StandardCard>
      </div>
    </div>
  );
}
