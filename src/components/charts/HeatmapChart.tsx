import EChart from './EChart';

export default function Heatmap({ data, xLabel = '', yLabel = '' }: {
  data: Array<{ x: string; y: string; value: number | null }>;
  xLabel?: string; yLabel?: string;
}) {
  const xs = Array.from(new Set((data||[]).map(d => d.x)));
  const ys = Array.from(new Set((data||[]).map(d => d.y)));
  const points = (data||[]).map(d => [xs.indexOf(d.x), ys.indexOf(d.y), typeof d.value === 'number' ? d.value : 0]);
  const vals = (data||[]).map(d => typeof d.value === 'number' ? d.value : 0);
  const min = vals.length ? Math.min(...vals) : 0;
  const max = vals.length ? Math.max(...vals) : 100;
  const option = {
    grid: { top: 16, right: 70, bottom: 40, left: 44 },
    tooltip: { position: 'top' },
    xAxis: { type: 'category', name: xLabel, data: xs, splitArea: { show: true } },
    yAxis: { type: 'category', name: yLabel, data: ys, splitArea: { show: true } },
    visualMap: { min, max, calculable: true, orient: 'vertical', right: 0, top: 'center' },
    series: [{ type: 'heatmap', data: points, label: { show: true, fontSize: 10 } }],
  };
  return <EChart option={option} />;
}
