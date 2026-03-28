import { StandardCard } from '@/components/standard-card';
import { HtmlCopy } from './html-copy';
import { MutedSubheader } from './muted-subheader';

interface TrackDomainCardProps {
  domain: string;
  domainId: string;
}

export function TrackDomainCard({ domain, domainId }: TrackDomainCardProps) {
  return (
    <StandardCard title="Track Your Domain">
      <TrackDomain domain={domain} domainId={domainId} />
    </StandardCard>
  );
}

interface TrackDomainProps {
  domain: string;
  domainId: string;
}

export function TrackDomain({ domain, domainId }: TrackDomainProps) {
  const scriptTag = `<script src="https://your-analytics-server.com/track.js" data-domain-id="${domainId}"></script>`;

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader
        label={`Add this script to the <head> of ${domain} to start collecting analytics:`}
      />
      <HtmlCopy html={scriptTag} />
    </div>
  );
}
