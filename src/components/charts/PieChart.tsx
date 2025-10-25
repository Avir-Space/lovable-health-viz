import EChart from './EChart';

export default function PieChart({ data, unit = '' }: { data: Array<{ category: string; value: number }>; unit?: string; }) {
  const chartData = data.map(d => ({ name: d.category, value: d.value }));
  const total = chartData.reduce((s, i) => s + i.value, 0);
  const option = {
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>${p.marker} ${p.value}${unit} (${((p.value/total)*100).toFixed(1)}%)` },
    legend: { bottom: 0, left: 'center' },
    series: [{ type: 'pie', radius: ['55%','75%'], label: { formatter: (p: any) => `${p.name}\n${p.value}${unit} (${p.percent}%)` }, data: chartData }]
  };
  return <EChart option={option} />;
}
