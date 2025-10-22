import ReactECharts from "echarts-for-react";
import { KPI_CHART_HEIGHT } from "@/lib/kpi-utils";

interface PieChartProps {
  data: Array<{ category: string; series?: string; value: number; }>;
  unit?: string;
}

export function PieChart({ data, unit = "" }: PieChartProps) {
  const seriesData = data.map(d => ({ name: d.category, value: d.value }));
  const total = seriesData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    tooltip: { 
      trigger: 'item',
      formatter: (params: any) => `${params.name}<br/>${params.marker} ${params.value}${unit} (${((params.value / total) * 100).toFixed(1)}%)`
    },
    legend: { bottom: 0, left: 'center' },
    series: [{
      type: 'pie', 
      radius: ['55%', '75%'], 
      data: seriesData,
      label: { show: true }
    }]
  };
  return <ReactECharts option={option} style={{ height: KPI_CHART_HEIGHT, width: "100%" }} />;
}
