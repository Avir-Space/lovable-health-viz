import ReactECharts from 'echarts-for-react';
import { fmt } from '@/lib/num';

export function LineChart({ data, unit='', xLabel='', yLabel='' }:{
  data: Array<{ bucket?: string; ts?: string; series?: string|null; value: number }>;
  unit?: string; xLabel?: string; yLabel?: string;
}) {
  const seriesMap: Record<string, {x:string;y:number}[]> = {};
  (data||[]).forEach(r=>{
    const k = r.series ?? 'value';
    (seriesMap[k] ||= []).push({x: r.bucket || r.ts || '', y: Number(r.value||0)});
  });
  const first = Object.values(seriesMap)[0] ?? [];
  const x = first.map(p=>p.x);

  const option = {
    grid: { top: 18, right: 16, bottom: 36, left: 52, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: Object.keys(seriesMap).length>1 ? { top: 0, left: 8, icon: 'circle', itemHeight: 8, textStyle:{fontSize:10} } : undefined,
    xAxis: { type:'category', boundaryGap:false, data:x, axisLabel:{interval:'auto', rotate: x.length>16?30:0, fontSize:10} },
    yAxis: { type:'value', axisLabel:{ formatter: (v:number)=>fmt(v, unit), fontSize:10 }, name: yLabel, nameGap: 30, nameLocation:'middle' },
    dataZoom: x.length>24 ? [{type:'inside'},{type:'slider', height:12, bottom:12}] : undefined,
    series: Object.entries(seriesMap).map(([name,pts])=>({
      name, type:'line', smooth:true, showSymbol:false, sampling:'lttb', data: pts.map(p=>p.y)
    })),
  };
  return <ReactECharts option={option} style={{height:270}} notMerge />;
}
