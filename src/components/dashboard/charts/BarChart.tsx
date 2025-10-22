import ReactECharts from "echarts-for-react";

interface BarChartProps {
  data: Array<{ category: string; series?: string; value: number; }>;
  unit?: string;
  xLabel?: string;
  yLabel?: string;
}

export function BarChart({ data, unit = "", xLabel = "", yLabel = "" }: BarChartProps) {
  const option = {
    grid: { top: 32, right: 24, bottom: 60, left: 56 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 45, data: data.map(d => d.category), axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: [{ type: 'bar', data: data.map(d => d.value), itemStyle: { color: '#3b82f6' } }]
  };
  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} />;
}
