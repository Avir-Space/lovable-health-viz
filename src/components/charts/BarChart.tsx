import EChart from './EChart';

export default function BarChart({ data, unit = '', xLabel = '', yLabel = '' }: { data: Array<{ category: string; value: number }>; unit?: string; xLabel?: string; yLabel?: string; }) {
  const categories = data.map(d => d.category);
  const values = data.map(d => d.value);
  const option = {
    grid: { top: 32, right: 24, bottom: 60, left: 56 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p: any[]) => `${p[0].axisValue}<br/>${p[0].marker} ${p[0].value}${unit}` },
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 45, data: categories, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: [{ type: 'bar', data: values }]
  };
  return <EChart option={option} />;
}
