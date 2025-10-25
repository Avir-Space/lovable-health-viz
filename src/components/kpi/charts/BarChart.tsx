import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatAxisNumber } from '../utils';

export function BarChart({ data, unit }:{
  data: Array<{ category: string; series?: string; value: number }>, unit?: string
}) {
  const option = useMemo(() => {
    const xs = data.map(d => d.category);
    const ys = data.map(d => d.value ?? 0);
    return {
      grid: { top: 24, right: 24, bottom: 64, left: 56 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: xs, axisLabel: { rotate: 30 } },
      yAxis: { type: 'value', axisLabel: { formatter: (v:number)=>formatAxisNumber(v, unit ? ` ${unit}` : '') } },
      series: [{ type: 'bar', data: ys, itemStyle: { borderRadius: [4,4,0,0] } }]
    };
  }, [data, unit]);

  return <ReactECharts style={{ height: '260px' }} option={option} notMerge />;
}
