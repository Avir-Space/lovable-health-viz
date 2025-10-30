import ReactECharts from "echarts-for-react";
import { KPI_CHART_HEIGHT } from "@/lib/kpi-utils";

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
    grid: { 
      top: 32, 
      right: 24, 
      bottom: 56, 
      left: 64,
      containLabel: true
    },
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => `${params[0].axisValue}<br/>${params[0].marker} ${params[0].value}${unit}`
    },
    xAxis: { 
      type: 'category', 
      name: xLabel, 
      nameLocation: 'middle', 
      nameGap: 45, 
      data: categories, 
      axisLabel: { 
        rotate: 30, 
        fontSize: 11,
        margin: 12
      } 
    },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 50, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: [{ type: 'bar', data: values }],
    media: [
      { 
        query: { maxWidth: 480 }, 
        option: { 
          grid: { bottom: 72 } 
        } 
      }
    ]
  };
  return <ReactECharts option={option} style={{ height: 300, width: "100%" }} />;
}
