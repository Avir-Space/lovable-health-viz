import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function EChart({ option, height = 220 }: { option: any; height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ReactECharts
        option={option}
        notMerge
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
