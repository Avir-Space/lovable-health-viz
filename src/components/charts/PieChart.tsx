import EChart from './EChart';

export default function PieChart({ data, unit = '' }: {
  data: Array<{ category: string; value: number | null }>;
  unit?: string;
}) {
  const series = (data || []).map(d => ({ name: d.category, value: typeof d.value === 'number' ? d.value : 0 }));
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}'+unit+' ({d}%)' },
    legend: { bottom: 0 },
    series: [{ type: 'pie', radius: ['55%', '75%'], data: series }],
  };
  return <EChart option={option} />;
}
