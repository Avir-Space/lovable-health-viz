import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

export function HeatmapChart({ data }:{
  data: Array<{ x: string; y: string; value: number }>
}) {
  const option = useMemo(() => {
    const xs = Array.from(new Set(data.map(d => d.x)));
    const ys = Array.from(new Set(data.map(d => d.y)));
    const vals = data.map(d => [xs.indexOf(d.x), ys.indexOf(d.y), d.value]);
    return {
      tooltip: { position: 'top' },
      grid: { top: 24, right: 24, bottom: 64, left: 56 },
      xAxis: { type: 'category', data: xs, axisLabel: { rotate: 30 } },
      yAxis: { type: 'category', data: ys },
      visualMap: { min: 0, max: Math.max(1, ...data.map(d=>d.value)), calculable: true,
                   orient: 'horizontal', left: 'center', bottom: 0 },
      series: [{ type: 'heatmap', data: vals, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }]
    };
  }, [data]);

  return <ReactECharts style={{ height: '260px' }} option={option} notMerge />;
}
