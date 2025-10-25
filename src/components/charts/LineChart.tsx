import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { TimeseriesPoint } from '@/types/kpi';
import { makeLineOptions, DASHBOARD_PALETTES } from '@/lib/ui/chartOptions';

export default function LineChart({
  data,
  unit = '',
  dashboard,
}: {
  data: TimeseriesPoint[];
  unit?: string;
  dashboard?: string;
}) {
  const option = useMemo(() => {
    const seriesMap: Record<string, { name: string; data: [string, number][] }> = {};
    (data || []).forEach((p) => {
      const key = p.series || 'value';
      if (!seriesMap[key]) seriesMap[key] = { name: key, data: [] };
      seriesMap[key].data.push([p.bucket || p.ts || '', Number(p.value) || 0]);
    });

    const x = (seriesMap[Object.keys(seriesMap)[0]]?.data || []).map((d) => d[0]);
    const series = Object.values(seriesMap).map((s) => ({
      name: s.name,
      data: s.data.map((d) => d[1]),
    }));

    const palette = dashboard ? DASHBOARD_PALETTES[dashboard] : undefined;
    return makeLineOptions({ x, series, unit, palette });
  }, [data, unit, dashboard]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
