import { Globe, Map, BarChart3 } from 'lucide-react';
import { ChartCard } from './chart-card';
import { WorldMapChart } from './world-map-chart';
import { TopCountriesChart } from './top-countries-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';

interface TopCountriesChartProps {
  delay: string;
}

export function TopCountries({ delay }: TopCountriesChartProps) {
  const tabList = (
    <TabsList>
      <TabsTrigger value="map" className="gap-2">
        <Map />
        <span className="md:flex hidden">Map</span>
      </TabsTrigger>
      <TabsTrigger value="list" className="gap-2">
        <BarChart3 />
        <span className="md:flex hidden">Bar Chart</span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs defaultValue="map">
      <ChartCard title="Top Countries" icon={Globe} delay={delay} tabList={tabList}>
        <TabsContent value="map">
          <WorldMapChart />
        </TabsContent>
        <TabsContent value="list">
          <TopCountriesChart />
        </TabsContent>
      </ChartCard>
    </Tabs>
  );
}
