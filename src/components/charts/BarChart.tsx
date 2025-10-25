import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { CategoryPoint } from '@/types/kpi';
import { makeBarOptions, DASHBOARD_PALETTES } from '@/lib/ui/chartOptions';

export default function BarChart({
  data,
  unit = '',
  dashboard,
}: {
  data: CategoryPoint[];
  unit?: string;
  dashboard?: string;
}) {
  const option = useMemo(() => {
    const x = (data || []).map((d) => d.category);
    const values = (data || []).map((d) => Number(d.value) || 0);
    const palette = dashboard ? DASHBOARD_PALETTES[dashboard] : undefined;
    return makeBarOptions({ x, values, unit, palette });
  }, [data, unit, dashboard]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
