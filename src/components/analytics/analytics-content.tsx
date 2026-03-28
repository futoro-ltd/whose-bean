'use client';

import { Eye, Users, FileText } from 'lucide-react';
import {
  StatCard,
  ActivityOverTimeChart,
  TopPagesChart,
  ReferrersChart,
  BrowsersChart,
  DevicesChart,
  OperatingSystemsChart,
  TopCountries,
} from '@/components/charts';
import { AnalyticsTables } from '@/components/analytics/analytics-tables';

interface AnalyticsContentProps {
  domainId: string;
}

export function AnalyticsContent({ domainId }: AnalyticsContentProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <StatCard
          title="Total Page Views"
          dataName="totalViews"
          icon={Eye}
          gradient="bg-gradient-to-br from-indigo-500 to-violet-500"
          delay="0.1s"
        />
        <StatCard
          title="Unique Visitors"
          dataName="uniqueVisitors"
          icon={Users}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
          delay="0.2s"
        />
        <StatCard
          title="Pages Tracked"
          dataName="uniquePagesCount"
          icon={FileText}
          gradient="bg-gradient-to-br from-fuchsia-500 to-pink-500"
          delay="0.3s"
        />
      </div>

      <AnalyticsTables domainId={domainId} delay="0.4s" />

      <div className="">
        <ActivityOverTimeChart delay="0.5s" />
      </div>

      <div className="">
        <TopCountries delay="0.6s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopPagesChart delay="0.7s" />
        <ReferrersChart delay="0.8s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <OperatingSystemsChart delay="0.9s" />
        <BrowsersChart delay="1s" />
        <DevicesChart delay="1.1s" />
      </div>
    </>
  );
}
