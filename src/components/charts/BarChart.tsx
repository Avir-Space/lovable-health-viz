import ReactECharts from 'echarts-for-react';
import { fmt } from '@/lib/num';

export function BarChart({ data, unit='', xLabel='', yLabel='' }:{
  data: Array<{category:string; value:number}>;
  unit?: string; xLabel?: string; yLabel?: string;
}) {
  const cats=(data||[]).map(d=>d.category);
  const vals=(data||[]).map(d=>Number(d.value||0));
  const option={
    grid:{ top:18, right:12, bottom:48, left:52, containLabel:true },
    tooltip:{ trigger:'axis', axisPointer:{type:'shadow'} },
    xAxis:{ type:'category', data:cats, axisLabel:{ fontSize:10, rotate: cats.length>8?25:0 } },
    yAxis:{ type:'value', axisLabel:{ formatter:(v:number)=>fmt(v, unit), fontSize:10 }, name:yLabel, nameGap:28, nameLocation:'middle' },
    series:[{ type:'bar', data:vals, barMaxWidth:28, itemStyle:{ borderRadius:[4,4,0,0] } }],
  };
  return <ReactECharts option={option} style={{height:270}} notMerge />;
}
