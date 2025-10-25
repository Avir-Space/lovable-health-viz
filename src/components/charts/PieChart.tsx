import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { CategoryPoint } from '@/types/kpi';
import { makePieOptions, DASHBOARD_PALETTES } from '@/lib/ui/chartOptions';

export default function PieChart({
  data,
  unit = '',
  dashboard,
}: {
  data: CategoryPoint[];
  unit?: string;
  dashboard?: string;
}) {
  const option = useMemo(() => {
    const pieData = (data || []).map((d) => ({
      name: d.category,
      value: Number(d.value) || 0,
    }));
    const palette = dashboard ? DASHBOARD_PALETTES[dashboard] : undefined;
    return makePieOptions({ data: pieData, unit, palette });
  }, [data, unit, dashboard]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
