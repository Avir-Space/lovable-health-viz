import ReactECharts from "echarts-for-react";

interface BarChartProps {
  data: Array<{ category: string; series?: string; value: number; }>;
  unit?: string;
  xLabel?: string;
  yLabel?: string;
}

export function BarChart({ data, unit = "", xLabel = "", yLabel = "" }: BarChartProps) {
  const categories = data.map(d => d.category);
  const values = data.map(d => d.value);
  
  const option = {
    grid: { top: 32, right: 24, bottom: 60, left: 56 },
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => `${params[0].axisValue}<br/>${params[0].marker} ${params[0].value}${unit}`
    },
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 45, data: categories, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: [{ type: 'bar', data: values }]
  };
  return <ReactECharts option={option} style={{ height: "260px", width: "100%" }} />;
}
