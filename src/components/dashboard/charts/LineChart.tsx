import ReactECharts from "echarts-for-react";

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
  const seriesMap: Record<string, Array<{ x: string; y: number }>> = {};
  
  data.forEach(row => {
    const seriesKey = row.series || 'value';
    if (!seriesMap[seriesKey]) seriesMap[seriesKey] = [];
    seriesMap[seriesKey].push({ x: row.bucket || row.ts || '', y: row.value });
  });

  const firstSeries = Object.values(seriesMap)[0] || [];
  const xAxisData = firstSeries.map(d => d.x);
  const seriesConfigs = Object.entries(seriesMap).map(([name, points]) => ({
    name, type: 'line', smooth: true, showSymbol: true, data: points.map(p => p.y)
  }));

  const option = {
    grid: { top: 32, right: 24, bottom: 48, left: 56 },
    tooltip: { trigger: 'axis' },
    legend: seriesConfigs.length > 1 ? { bottom: 0 } : undefined,
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 30, data: xAxisData, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value', name: yLabel, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${unit}` } },
    series: seriesConfigs
  };

  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} />;
}
