import EChart from './EChart';

export default function LineChart({ data, unit = '', xLabel = '', yLabel = '' }: {
  data: Array<{ ts?: string | null; bucket?: string | null; series?: string | null; value: number | null }>;
  unit?: string; xLabel?: string; yLabel?: string;
}) {
  const seriesMap: Record<string, number[]> = {};
  const x: string[] = [];
  (data || []).forEach((r) => {
    const key = r.series || 'value';
    if (!seriesMap[key]) seriesMap[key] = [];
    const xv = r.bucket || r.ts || '';
    if (x.indexOf(xv) === -1) x.push(xv);
    seriesMap[key].push(typeof r.value === 'number' ? r.value : 0);
  });
  const series = Object.entries(seriesMap).map(([name, vals]) => ({
    name, type: 'line', smooth: true, showSymbol: false, data: vals,
  }));
  const option = {
    grid: { top: 24, right: 16, bottom: 36, left: 44 },
    tooltip: { trigger: 'axis' },
    legend: series.length > 1 ? { bottom: 0 } : undefined,
    xAxis: { type: 'category', name: xLabel, data: x, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series,
  };
  return <EChart option={option} />;
}
