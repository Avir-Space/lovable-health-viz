import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

export function PieChart({ data, unit }:{
  data: Array<{ category: string; value: number }>, unit?: string
}) {
  const option = useMemo(() => {
    const seriesData = data.map(d => ({ name: d.category, value: d.value }));
    return {
      tooltip: { trigger: 'item', formatter: (p:any) => `${p.name}: ${p.value}${unit || ''} (${p.percent}%)` },
      legend:  { orient: 'vertical', right: 0, top: 'middle', textStyle: { fontSize: 12 } },
      series: [{
        type: 'pie', radius: ['55%','75%'], minAngle: 10, avoidLabelOverlap: true,
        labelLine: { length: 12, length2: 8 }, labelLayout: () => ({ hideOverlap: true }),
        data: seriesData
      }]
    };
  }, [data, unit]);

  return <ReactECharts style={{ height: '260px' }} option={option} notMerge />;
}
