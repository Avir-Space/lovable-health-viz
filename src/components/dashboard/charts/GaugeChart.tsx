import ReactECharts from "echarts-for-react";

interface GaugeChartProps {
  value: number;
  unit?: string;
  max?: number;
}

export function GaugeChart({ value, unit = "%", max = 100 }: GaugeChartProps) {
  const option = {
    series: [{ type: 'gauge', startAngle: 180, endAngle: 0, min: 0, max,
      axisLine: { lineStyle: { width: 20, color: [[0.7, '#00C49F'], [0.9, '#FFBB28'], [1, '#FF8042']] } },
      detail: { valueAnimation: true, formatter: `{value}${unit}`, fontSize: 28, fontWeight: 'bold', offsetCenter: [0, '70%'] },
      data: [{ value }]
    }]
  };
  return <ReactECharts option={option} style={{ height: "260px", width: "100%" }} />;
}
