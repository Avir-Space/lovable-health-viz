import ReactECharts from 'echarts-for-react';

export function PieChart({ data, unit='' }:{ data:Array<{category:string; value:number}>; unit?:string }) {
  const d=(data||[]).map(r=>({name:r.category, value:Number(r.value||0)}));
  const option={
    tooltip:{ trigger:'item', formatter:(p:any)=>`${p.name}: ${p.value}${unit} (${p.percent}%)` },
    legend:{ type:'scroll', orient:'vertical', right:0, top:20, bottom:20, textStyle:{fontSize:10} },
    series:[{ type:'pie', radius:['55%','75%'], center:['40%','50%'], data:d, label:{ show:false } }]
  };
  return <ReactECharts option={option} style={{height:270}} notMerge />;
}
