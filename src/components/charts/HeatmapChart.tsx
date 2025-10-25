import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { HeatmapPoint } from '@/types/kpi';
import { makeHeatmapOptions } from '@/lib/ui/chartOptions';

export default function Heatmap({ data }: { data: HeatmapPoint[] }) {
  const option = useMemo(() => {
    const xLabels = Array.from(new Set((data || []).map((d) => d.x)));
    const yLabels = Array.from(new Set((data || []).map((d) => d.y)));
    const values = (data || []).map((d) => ({
      x: d.x,
      y: d.y,
      value: Number(d.value) || 0,
    }));
    return makeHeatmapOptions({ xLabels, yLabels, values });
  }, [data]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
