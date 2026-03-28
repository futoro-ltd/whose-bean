import { StandardCard } from '@/components/standard-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';
import { TrackDomain } from '@/components/track-domain-card';
import { DomainAccessManager } from '@/components/domain-access/domain-access-manager';
import { DomainDangerZone } from '@/components/admin/domain-danger-zone';
import { AlertTriangleIcon, CodeXml, Users } from 'lucide-react';

interface AdminControlCardProps {
  domain: string;
  domainId: string;
}

export function AdminControlCard({ domain, domainId }: AdminControlCardProps) {
  const tabList = (
    <TabsList>
      <TabsTrigger value="track" className="gap-2">
        <CodeXml />
        <span className="md:flex hidden">Track Your Domain</span>
      </TabsTrigger>
      <TabsTrigger value="access" className="gap-2">
        <Users />
        <span className="md:flex hidden">User Access</span>
      </TabsTrigger>
      <TabsTrigger value="danger" className="gap-2">
        <AlertTriangleIcon />
        <span className="md:flex hidden">Danger Zone</span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs defaultValue="track">
      <StandardCard title="Admin Control" tabs={tabList} className="min-h-72">
        <TabsContent value="track" className="overflow-auto">
          <TrackDomain domain={domain} domainId={domainId} />
        </TabsContent>
        <TabsContent value="access" className="overflow-auto">
          <DomainAccessManager domainId={domainId} />
        </TabsContent>
        <TabsContent value="danger" className="overflow-auto">
          <DomainDangerZone domain={domain} domainId={domainId} />
        </TabsContent>
      </StandardCard>
    </Tabs>
  );
}
