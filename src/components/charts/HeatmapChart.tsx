import EChart from './EChart';

export default function HeatmapChart({ data, xLabel = '', yLabel = '' }: { data: Array<{ x: string; y: string; value: number }>; xLabel?: string; yLabel?: string; }) {
  const xs = Array.from(new Set(data.map(d => d.x))).sort();
  const ys = Array.from(new Set(data.map(d => d.y))).sort();
  const grid = data.map(d => [xs.indexOf(d.x), ys.indexOf(d.y), d.value]);
  const values = data.map(d => d.value);
  const min = Math.min(...values), max = Math.max(...values);
  const option = {
    grid: { top: 32, right: 80, bottom: 48, left: 56 },
    tooltip: { position: 'top', formatter: (p: any) => `${xs[p.data[0]]} × ${ys[p.data[1]]}<br/>Value: ${p.data[2]}` },
    xAxis: { type: 'category', name: xLabel, data: xs, splitArea: { show: true } },
    yAxis: { type: 'category', name: yLabel, data: ys, splitArea: { show: true } },
    visualMap: { min, max, calculable: true, orient: 'vertical', right: 0, top: 'center' },
    series: [{ type: 'heatmap', data: grid, label: { show: true, fontSize: 11 } }]
  };
  return <EChart option={option} />;
}
