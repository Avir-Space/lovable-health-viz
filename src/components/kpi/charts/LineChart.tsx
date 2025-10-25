import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { RangeTag, formatDateByRange, formatAxisNumber } from '../utils';

export function LineChart({ data, unit, range }:{
  data: Array<{ ts?: string; bucket?: string; series?: string; value: number }>,
  unit?: string, range: RangeTag
}) {
  const option = useMemo(() => {
    const xs = data.map(d => formatDateByRange(d.ts ?? d.bucket ?? '', range));
    const ys = data.map(d => d.value ?? 0);
    return {
      grid: { top: 24, right: 24, bottom: 64, left: 56 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: xs,
        axisLabel: { rotate: 30, formatter: (v: string) => (v.length > 12 ? v.slice(0,11)+'…' : v) }
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (v: number) => formatAxisNumber(v, unit ? ` ${unit}` : '') }
      },
      series: [{
        type: 'line', smooth: true, showSymbol: false,
        areaStyle: { opacity: 0.06 }, lineStyle: { width: 2 }, data: ys
      }]
    };
  }, [data, unit, range]);

  return <ReactECharts style={{ height: '260px' }} option={option} notMerge />;
}
