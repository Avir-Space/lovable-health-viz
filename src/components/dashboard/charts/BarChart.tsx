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
      top: 28, 
      right: 12, 
      bottom: 42, 
      left: 52,
      containLabel: true
    },
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      confine: true,
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
        margin: 12,
        hideOverlap: true
      } 
    },
    yAxis: { 
      type: 'value', 
      name: yLabel, 
      nameLocation: 'middle', 
      nameGap: 50, 
      axisLabel: { 
        formatter: (v: number) => `${v}${unit}`,
        hideOverlap: true
      } 
    },
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
