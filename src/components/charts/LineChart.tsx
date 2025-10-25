import ReactECharts from 'echarts-for-react';
import { TimeseriesPoint } from '@/types/kpi';

export default function LineChart({ data, unit = '' }: { data: TimeseriesPoint[]; unit?: string }) {
  const seriesMap: Record<string, { name: string; data: [string, number][] }> = {};
  (data || []).forEach(p => {
    const key = p.series || 'value';
    if (!seriesMap[key]) seriesMap[key] = { name: key, data: [] };
    seriesMap[key].data.push([p.bucket || p.ts || '', Number(p.value) || 0]);
  });
  const x = (seriesMap[Object.keys(seriesMap)[0]]?.data || []).map(d => d[0]);
  const series = Object.values(seriesMap).map(s => ({
    name: s.name, type: 'line', smooth: true, showSymbol: false, data: s.data.map(d=>d[1])
  }));

  const option = {
    grid: { top: 20, right: 16, bottom: 28, left: 36 },
    tooltip: { trigger: 'axis', formatter: (params:any)=>params.map((p:any)=>`${p.seriesName}: ${p.value}${unit}`).join('<br/>') },
    legend: series.length>1 ? { bottom: 0 } : undefined,
    xAxis: { type: 'category', data: x, axisLabel: { rotate: 30, fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { formatter: (v:number)=>`${v}${unit}` } },
    series
  };
  return <ReactECharts option={option} style={{ height: 180 }} />;
}
