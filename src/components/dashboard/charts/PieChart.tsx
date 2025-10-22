import ReactECharts from "echarts-for-react";

interface PieChartProps {
  data: Array<{ category: string; series?: string; value: number; }>;
  unit?: string;
}

export function PieChart({ data, unit = "" }: PieChartProps) {
  const chartData = data.map(d => ({ name: d.category, value: d.value }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie', radius: ['55%', '75%'], avoidLabelOverlap: true,
      label: { formatter: (p: any) => `{b|${p.name}}\n{c|${p.value}${unit}} ({d|${((p.value/total)*100).toFixed(1)}%})` },
      data: chartData
    }]
  };
  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} />;
}
