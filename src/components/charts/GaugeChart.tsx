import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { makeGaugeOptions } from '@/lib/ui/chartOptions';

export default function GaugeChart({
  value,
  unit = '%',
  max = 100,
}: {
  value: number;
  unit?: string;
  max?: number;
}) {
  const option = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          center: ['50%', '52%'],
          radius: '85%',
          min: 0,
          max,
          axisLine: {
            lineStyle: {
              width: 14,
              color: [
                [0.7, '#22c55e'],
                [0.9, '#f59e0b'],
                [1.0, '#ef4444']
              ],
            },
            roundCap: true,
          },
          axisTick: { distance: -16, length: 6, lineStyle: { color: '#cbd5e1' } },
          splitLine: { distance: -18, length: 10, lineStyle: { color: '#cbd5e1' } },
          axisLabel: { distance: 18, color: '#475569', fontSize: 11 },
          pointer: { length: '58%', width: 6, itemStyle: { color: '#334155' } },
          detail: {
            show: true,
            offsetCenter: [0, '80%'],
            valueAnimation: true,
            formatter: `{value}${unit}`,
            fontSize: 28,
            fontWeight: 700,
            color: '#0f172a',
          },
          data: [{ value }],
        },
      ],
    };
  }, [value, unit, max]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
