import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useChartTooltipStyle } from '@/lib/chart-tooltip';
import { getCountryISO3Code } from '@/data/country-codes';
import { useCountriesData } from '@/hooks/use-analytics-data';
import { MutedSubheader } from '../muted-subheader';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export function WorldMapChart() {
  const data = useCountriesData();
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [isDark, setIsDark] = useState(false);
  const tooltipStyle = useChartTooltipStyle();

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const countryDataMap = new Map(data.map((d) => [getCountryISO3Code(d.country), d]));

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getFillColor = (geo: { properties?: { name?: string; [key: string]: unknown } }) => {
    const countryName = geo.properties?.name;
    if (!countryName) return 'transparent';

    const isoCode = getCountryISO3Code(countryName);
    const countryData = countryDataMap.get(isoCode);

    if (!countryData) {
      return isDark ? 'hsl(240, 5%, 40%)' : 'hsl(240, 5%, 40%)';
    }

    const intensity = countryData.count / maxCount;
    const opacity = 0.3 + intensity * 0.7;
    return `hsla(245, 89%, 63%, ${opacity})`;
  };

  const getStrokeColor = (geo: { properties?: { name?: string; [key: string]: unknown } }) => {
    const countryName = geo.properties?.name;
    if (!countryName) return 'transparent';

    const isoCode = getCountryISO3Code(countryName);
    const hasData = countryDataMap.has(isoCode);

    return hasData ? 'hsl(245, 89%, 63%)' : 'transparent';
  };

  return (
    <div className="flex flex-col space-y-4">
      <MutedSubheader label="Map of visiting countries" />
      <div className="relative flex flex-col items-center">
        <ComposableMap projectionConfig={{ scale: 190 }} className="md:h-[600px] h-[300px] w-full">
          <ZoomableGroup zoom={1.2} minZoom={1.2} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties?.name;
                  const isoCode = countryName ? getCountryISO3Code(countryName) : '';
                  const countryData = countryDataMap.get(isoCode);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getFillColor(geo)}
                      stroke={getStrokeColor(geo)}
                      strokeWidth={countryData ? 1 : 0}
                      style={{
                        default: {
                          outline: 'none',
                        },
                        hover: {
                          fill: countryData
                            ? 'hsl(245, 89%, 55%)'
                            : isDark
                              ? 'hsl(240, 5%, 25%)'
                              : 'hsl(240, 5%, 55%)',
                          outline: 'none',
                          cursor: countryData ? 'pointer' : 'default',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={() => {
                        if (countryData) {
                          setTooltipContent(
                            `${countryName} - count: ${countryData.count.toLocaleString()}`
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        {tooltipContent && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 text-sm whitespace-nowrap"
            style={{
              background: tooltipStyle.contentStyle.background,
              color: tooltipStyle.contentStyle.color,
              borderRadius: tooltipStyle.contentStyle.borderRadius,
              boxShadow: tooltipStyle.contentStyle.boxShadow,
            }}
          >
            {tooltipContent}
          </div>
        )}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
              <div
                key={opacity}
                className="w-4 h-3 rounded-sm"
                style={{ backgroundColor: `hsla(245, 89%, 63%, ${opacity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
