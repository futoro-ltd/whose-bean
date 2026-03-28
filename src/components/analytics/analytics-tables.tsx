import { Table, Eye, Users } from 'lucide-react';
import { ChartCard } from '@/components/charts/chart-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';
import { PageViewsTableContent } from '@/components/page-views-table-content';
import { VisitorsTableContent } from '@/components/visitors-table-content';

interface AnalyticsTablesProps {
  domainId: string;
  delay: string;
}

export function AnalyticsTables({ domainId, delay }: AnalyticsTablesProps) {
  const tabList = (
    <TabsList>
      <TabsTrigger value="pageviews" className="gap-2">
        <Eye /><span className="md:flex hidden">Page View Details</span>
      </TabsTrigger>
      <TabsTrigger value="visitors" className="gap-2">
        <Users /><span className="md:flex hidden">Visitor Details</span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs defaultValue="pageviews">
      <ChartCard title="Analytics Details" icon={Table} delay={delay} tabList={tabList}>
        <TabsContent value="pageviews" className="mt-0 overflow-auto min-h-[470px]">
          <PageViewsTableContent domainId={domainId} />
        </TabsContent>
        <TabsContent value="visitors" className="mt-0 overflow-auto min-h-[470px]">
          <VisitorsTableContent domainId={domainId} />
        </TabsContent>
      </ChartCard>
    </Tabs>
  );
}
