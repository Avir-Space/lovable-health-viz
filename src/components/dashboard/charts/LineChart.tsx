import ReactECharts from "echarts-for-react";
import { formatXAxisDateLabel, KPI_CHART_HEIGHT } from "@/lib/kpi-utils";

interface LineChartProps {
  data: Array<{
    bucket?: string;
    ts?: string;
    series?: string;
    value: number;
  }>;
  unit?: string;
  xLabel?: string;
  yLabel?: string;
}

export function LineChart({ data, unit = "", xLabel = "", yLabel = "" }: LineChartProps) {
  const bySeries: Record<string, Array<{ x: string; y: number }>> = {};
  
  data.forEach(row => {
    const seriesKey = row.series || 'value';
    if (!bySeries[seriesKey]) bySeries[seriesKey] = [];
    bySeries[seriesKey].push({ x: row.bucket || row.ts || '', y: row.value });
  });

  const firstSeries = Object.values(bySeries)[0] || [];
  const xAxisData = firstSeries.map(d => d.x);
  const seriesConfigs = Object.entries(bySeries).map(([name, points]) => ({
    name, type: 'line', smooth: true, showSymbol: true, data: points.map(p => p.y)
  }));

  const formattedXAxis = xAxisData.map(formatXAxisDateLabel);
  
  const option = {
    grid: { top: 32, right: 24, bottom: 58, left: 64 },
    tooltip: { 
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((item: any) => {
          result += `${item.marker} ${item.seriesName}: ${item.value}${unit}<br/>`;
        });
        return result;
      }
    },
    legend: seriesConfigs.length > 1 ? { bottom: 0 } : undefined,
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 30, data: formattedXAxis, axisLabel: { rotate: 18, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 50, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: seriesConfigs
  };

  return <ReactECharts option={option} style={{ height: 300, width: "100%" }} />;
}
