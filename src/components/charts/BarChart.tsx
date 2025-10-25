import ReactECharts from 'echarts-for-react';
import { CategoryPoint } from '@/types/kpi';

export default function BarChart({ data, unit = '' }: { data: CategoryPoint[]; unit?: string }) {
  const cats = (data || []).map(d => d.category);
  const vals = (data || []).map(d => Number(d.value) || 0);
  const option = {
    grid: { top: 20, right: 10, bottom: 36, left: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p:any)=>`${p[0].axisValue}: ${p[0].value}${unit}` },
    xAxis: { type: 'category', data: cats, axisLabel: { rotate: 25, fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { formatter: (v:number)=>`${v}${unit}` } },
    series: [{ type: 'bar', data: vals, itemStyle: { color: '#3b82f6' } }]
  };
  return <ReactECharts option={option} style={{ height: 180 }} />;
}
