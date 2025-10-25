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
    return makeGaugeOptions({ value, unit, max });
  }, [value, unit, max]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}
