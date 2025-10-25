import EChart from './EChart';

export default function BarChart({ data, unit = '', xLabel = '', yLabel = '' }: {
  data: Array<{ category: string; value: number | null }>;
  unit?: string; xLabel?: string; yLabel?: string;
}) {
  const cats = (data || []).map(d => d.category);
  const vals = (data || []).map(d => (typeof d.value === 'number' ? d.value : 0));
  const option = {
    grid: { top: 24, right: 16, bottom: 44, left: 44 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', name: xLabel, data: cats, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: [{ type: 'bar', data: vals }],
  };
  return <EChart option={option} />;
}
