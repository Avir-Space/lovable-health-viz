import ReactECharts from "echarts-for-react";

interface HeatmapChartProps {
  data: Array<{ x: string; y: string; value: number; }>;
  xLabel?: string;
  yLabel?: string;
}

export function HeatmapChart({ data, xLabel = "", yLabel = "" }: HeatmapChartProps) {
  const xLabels = Array.from(new Set(data.map(d => d.x))).sort();
  const yLabels = Array.from(new Set(data.map(d => d.y))).sort();
  const heatmapData = data.map(d => [xLabels.indexOf(d.x), yLabels.indexOf(d.y), d.value]);
  const values = data.map(d => d.value);

  const option = {
    grid: { top: 32, right: 80, bottom: 48, left: 56 },
    tooltip: { position: 'top' },
    xAxis: { type: 'category', name: xLabel, data: xLabels, splitArea: { show: true } },
    yAxis: { type: 'category', name: yLabel, data: yLabels, splitArea: { show: true } },
    visualMap: { min: Math.min(...values), max: Math.max(...values), calculable: true, orient: 'vertical', right: 0 },
    series: [{ type: 'heatmap', data: heatmapData, label: { show: true, fontSize: 11 } }]
  };
  return <ReactECharts option={option} style={{ height: "260px", width: "100%" }} />;
}
