import ReactECharts from "echarts-for-react";

interface GaugeChartProps {
  value: number;
  unit?: string;
  max?: number;
}

export function GaugeChart({ value, unit = "%", max = 100 }: GaugeChartProps) {
  const option = {
    series: [{ 
      type: 'gauge', 
      min: 0, 
      max, 
      startAngle: 180, 
      endAngle: 0,
      detail: { 
        formatter: `{value}${unit}`, 
        fontSize: 28, 
        fontWeight: 'bold' 
      }, 
      data: [{ value }] 
    }]
  };
  return <ReactECharts option={option} style={{ height: "260px", width: "100%" }} />;
}
