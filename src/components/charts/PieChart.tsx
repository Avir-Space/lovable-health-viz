import ReactECharts from 'echarts-for-react';
import { CategoryPoint } from '@/types/kpi';

export default function PieChart({ data, unit = '' }: { data: CategoryPoint[]; unit?: string }) {
  const seriesData = (data || []).map(d => ({ name: d.category, value: Number(d.value) || 0 }));
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}'+unit+' ({d}%)' },
    legend: { bottom: 0 },
    series: [{ type: 'pie', radius: ['50%', '70%'], data: seriesData, label: { show: true } }]
  };
  return <ReactECharts option={option} style={{ height: 180 }} />;
}
