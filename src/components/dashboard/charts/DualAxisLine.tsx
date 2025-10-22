import ReactECharts from "echarts-for-react";

interface DualAxisLineProps {
  data: Array<{
    bucket?: string;
    ts?: string;
    series?: string;
    value: number;
  }>;
  seriesMap: Record<string, number>; // e.g., { "value": 0, "minutes_7d": 1 }
  rightAxisName?: string;
  unitLeft?: string;
  unitRight?: string;
  xLabel?: string;
  yLabel?: string;
}

export function DualAxisLine({
  data,
  seriesMap,
  rightAxisName,
  unitLeft = "",
  unitRight = "",
  xLabel = "",
  yLabel = ""
}: DualAxisLineProps) {
  // Group data by series
  const seriesData: Record<string, Array<{ x: string; y: number }>> = {};
  
  data.forEach(row => {
    const seriesKey = row.series || 'value';
    if (!seriesData[seriesKey]) {
      seriesData[seriesKey] = [];
    }
    seriesData[seriesKey].push({
      x: row.bucket || row.ts || '',
      y: row.value
    });
  });

  // Build x-axis data (use first series as reference)
  const firstSeriesKey = Object.keys(seriesData)[0];
  const xAxisData = seriesData[firstSeriesKey]?.map(d => d.x) || [];

  // Build series configurations
  const seriesConfigs = Object.entries(seriesData).map(([seriesKey, points]) => {
    const axisIndex = seriesMap[seriesKey] || 0;
    return {
      name: seriesKey === 'value' ? yLabel : rightAxisName || seriesKey,
      type: axisIndex === 0 ? 'line' : 'bar',
      yAxisIndex: axisIndex,
      data: points.map(p => p.y),
      smooth: axisIndex === 0,
      showSymbol: true,
    };
  });

  const option = {
    grid: { top: 40, right: 60, bottom: 48, left: 60 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((item: any) => {
          const unit = item.seriesIndex === 0 ? unitLeft : unitRight;
          result += `${item.marker} ${item.seriesName}: ${item.value}${unit}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: seriesConfigs.map(s => s.name),
      bottom: 0
    },
    xAxis: {
      type: 'category',
      name: xLabel,
      nameLocation: 'middle',
      nameGap: 30,
      data: xAxisData,
      axisLabel: { rotate: 30, fontSize: 11 }
    },
    yAxis: [
      {
        type: 'value',
        name: yLabel,
        nameLocation: 'middle',
        nameGap: 45,
        axisLabel: {
          formatter: (value: number) => `${value}${unitLeft}`
        }
      },
      {
        type: 'value',
        name: rightAxisName,
        nameLocation: 'middle',
        nameGap: 45,
        axisLabel: {
          formatter: (value: number) => `${value}${unitRight}`
        }
      }
    ],
    series: seriesConfigs
  };

  return <ReactECharts option={option} style={{ height: "280px", width: "100%" }} />;
}
