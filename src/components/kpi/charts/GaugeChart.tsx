import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

export function GaugeChart({ value, unit }:{ value: number, unit?: string }) {
  const option = useMemo(() => ({
    series: [{
      type: 'gauge',
      progress: { show: true, width: 10 },
      axisLine: { lineStyle: { width: 10 } },
      axisTick: { show: false }, splitLine: { show: false },
      axisLabel: { show: false }, pointer: { show: false },
      detail: { valueAnimation: true, formatter: (v:number)=>`${v}${unit || ''}`, fontSize: 18 },
      data: [{ value }]
    }]
  }), [value, unit]);

  return <ReactECharts style={{ height: '260px' }} option={option} notMerge />;
}
