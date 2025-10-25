import ReactECharts from 'echarts-for-react';

export default function GaugeChart({ value, unit = '%' }: { value: number; unit?: string }) {
  const option = {
    series: [{
      type: 'gauge', startAngle: 180, endAngle: 0, min: 0, max: 100,
      axisLine: { lineStyle: { width: 18 } },
      detail: { formatter: (v:number)=>`${v}${unit}`, fontSize: 22, offsetCenter: [0,'60%'] },
      data: [{ value }]
    }]
  };
  return <ReactECharts option={option} style={{ height: 180 }} />;
}
