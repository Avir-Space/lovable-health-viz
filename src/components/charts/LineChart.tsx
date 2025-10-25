import EChart from './EChart';

interface LineChartProps {
  data: Array<{ bucket?: string; ts?: string; series?: string; value: number }>;
  unit?: string;
  xLabel?: string;
  yLabel?: string;
}

export default function LineChart({ data, unit = '', xLabel = '', yLabel = '' }: LineChartProps) {
  const grouped = new Map<string, Array<{ x: string; y: number }>>();
  data.forEach(row => {
    const s = row.series || 'value';
    const x = row.bucket || row.ts || '';
    if (!grouped.has(s)) grouped.set(s, []);
    grouped.get(s)!.push({ x, y: row.value });
  });
  const first = grouped.values().next().value || [];
  const xAxisData = first.map(p => p.x);

  const series = Array.from(grouped.entries()).map(([name, points]) => ({
    name,
    type: 'line',
    smooth: true,
    showSymbol: true,
    data: points.map(p => p.y)
  }));

  const option = {
    grid: { top: 32, right: 24, bottom: 48, left: 56 },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        let r = `${params[0].axisValue}`;
        params.forEach(item => { r += `<br/>${item.marker} ${item.seriesName}: ${item.value}${unit}`; });
        return r;
      }
    },
    legend: series.length > 1 ? { bottom: 0 } : undefined,
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 30, data: xAxisData, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series
  };
  return <EChart option={option} />;
}
