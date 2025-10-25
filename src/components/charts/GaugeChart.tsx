import EChart from './EChart';

export default function GaugeChart({ value, unit = '%', max = 100 }: { value: number; unit?: string; max?: number }) {
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180, endAngle: 0, min: 0, max,
      splitNumber: 8,
      axisLine: { lineStyle: { width: 20, color: [[0.7,'#10b981'],[0.9,'#f59e0b'],[1,'#ef4444']] } },
      pointer: { itemStyle: { color: 'auto' } },
      axisLabel: { distance: 20, fontSize: 11 },
      detail: { valueAnimation: true, formatter: `{value}${unit}`, fontSize: 24, fontWeight: 'bold', offsetCenter: [0,'70%'] },
      data: [{ value }]
    }]
  };
  return <EChart option={option} />;
}
