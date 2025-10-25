import EChart from './EChart';

interface Props {
  data: Array<{ bucket?: string; ts?: string; series?: string; value: number }>;
  seriesMap: Record<string, 0 | 1>;
  leftName?: string;
  rightName?: string;
  leftUnit?: string;
  rightUnit?: string;
  xLabel?: string;
}

export default function DualAxisLine({ data, seriesMap, leftName = '', rightName = '', leftUnit = '', rightUnit = '', xLabel = '' }: Props) {
  const grouped = new Map<string, Array<{ x: string; y: number }>>();
  data.forEach(row => {
    const s = row.series || 'value';
    const x = row.bucket || row.ts || '';
    if (!grouped.has(s)) grouped.set(s, []);
    grouped.get(s)!.push({ x, y: row.value });
  });
  const first = grouped.values().next().value || [];
  const xAxisData = first.map(p => p.x);

  const series = Array.from(grouped.entries()).map(([name, points]) => ({
    name,
    type: seriesMap[name] === 1 ? 'bar' : 'line',
    yAxisIndex: seriesMap[name] || 0,
    smooth: seriesMap[name] === 0,
    showSymbol: true,
    data: points.map(p => p.y)
  }));

  const option = {
    grid: { top: 40, right: 60, bottom: 48, left: 60 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any[]) => {
        let r = `${params[0].axisValue}`;
        params.forEach(item => {
          const unit = item.seriesIndex === 0 ? leftUnit : rightUnit;
          r += `<br/>${item.marker} ${item.seriesName}: ${item.value}${unit}`;
        });
        return r;
      }
    },
    legend: { bottom: 0 },
    xAxis: { type: 'category', name: xLabel, nameLocation: 'middle', nameGap: 30, data: xAxisData, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: [
      { type: 'value', name: leftName, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${leftUnit}` } },
      { type: 'value', name: rightName, nameLocation: 'middle', nameGap: 45, axisLabel: { formatter: (v: number) => `${v}${rightUnit}` } }
    ],
    series
  };
  return <EChart option={option} />;
}
