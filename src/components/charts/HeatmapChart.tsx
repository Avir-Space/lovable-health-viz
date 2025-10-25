import ReactECharts from 'echarts-for-react';
import { HeatmapPoint } from '@/types/kpi';

export default function Heatmap({ data }: { data: HeatmapPoint[] }) {
  const xs = Array.from(new Set((data||[]).map(d=>d.x)));
  const ys = Array.from(new Set((data||[]).map(d=>d.y)));
  const map = (data||[]).map(d => [xs.indexOf(d.x), ys.indexOf(d.y), Number(d.value)||0]);
  const values = map.map(m=>m[2]); const min = values.length ? Math.min(...values) : 0; const max = values.length ? Math.max(...values) : 1;

  const option = {
    grid: { top: 20, right: 60, bottom: 36, left: 36 },
    tooltip: { position: 'top', formatter: (p:any)=>`${xs[p.data[0]]} × ${ys[p.data[1]]}: ${p.data[2]}` },
    xAxis: { type: 'category', data: xs, splitArea: { show: true } },
    yAxis: { type: 'category', data: ys, splitArea: { show: true } },
    visualMap: { min, max, calculable: true, orient: 'vertical', right: 0 },
    series: [{ type: 'heatmap', data: map, label: { show: true, fontSize: 10 } }]
  };
  return <ReactECharts option={option} style={{ height: 180 }} />;
}
