import EChart from './EChart';

export default function GaugeChart({ value = 0, unit = '%' }: { value?: number | null; unit?: string }) {
  const v = Math.max(0, Math.min(100, typeof value === 'number' ? value : 0));
  const option = {
    series: [{
      type: 'gauge', startAngle: 180, endAngle: 0, min: 0, max: 100,
      detail: { formatter: `${v}${unit}`, fontSize: 22, offsetCenter: [0, '60%'] },
      axisLine: { lineStyle: { width: 18 } }, data: [{ value: v }],
    }],
  };
  return <EChart option={option} height={180} />;
}
