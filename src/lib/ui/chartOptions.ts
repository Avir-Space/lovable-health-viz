import type { EChartsOption } from 'echarts';

export const DASHBOARD_PALETTES: Record<string, string[]> = {
  'maintenance-health-overview': ['#2563eb', '#06b6d4', '#f59e0b', '#10b981'],
  'inventory-spares-visibility': ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'],
  'compliance-airworthiness': ['#22c55e', '#a78bfa', '#f97316', '#dc2626'],
  'ops-dispatch-reliability': ['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b'],
  'fuel-efficiency': ['#f59e0b', '#22c55e', '#3b82f6', '#ef4444'],
  'financial-procurement': ['#0ea5e9', '#a78bfa', '#f97316', '#22c55e'],
  'crew-duty-snapshot': ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b'],
};

export function makeLineOptions({
  x,
  series,
  unit = '',
  palette = ['#2563eb', '#06b6d4', '#f59e0b', '#10b981'],
}: {
  x: string[];
  series: Array<{ name: string; data: number[] }>;
  unit?: string;
  palette?: string[];
}): EChartsOption {
  return {
    color: palette,
    grid: { 
      top: 28, 
      right: 12, 
      bottom: 42, 
      left: 52,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any) => {
        const axis = params?.[0]?.axisValue ?? '';
        const lines = params
          .map((p: any) => `${p.marker} ${p.seriesName}: ${p.value}${unit}`)
          .join('<br/>');
        return `<strong>${axis}</strong><br/>${lines}`;
      },
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: {
        rotate: 30,
        fontSize: 11,
        color: '#71717a',
        hideOverlap: true,
        margin: 12,
        formatter: (v: string) => (v?.length > 10 ? v.slice(0, 10) : v),
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (v: number) => `${v}${unit}`,
        fontSize: 11,
        color: '#71717a',
        hideOverlap: true,
      },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    legend:
      series.length > 1
        ? { bottom: 4, textStyle: { fontSize: 11 } }
        : undefined,
    series: series.map((s) => ({
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: s.data,
      name: s.name,
    })),
    media: [
      { 
        query: { maxWidth: 480 }, 
        option: { 
          grid: { bottom: 72 } 
        } 
      }
    ]
  };
}

export function makeBarOptions({
  x,
  values,
  unit = '',
  palette = ['#3b82f6'],
}: {
  x: string[];
  values: number[];
  unit?: string;
  palette?: string[];
}): EChartsOption {
  return {
    color: [palette[0] ?? '#3b82f6'],
    grid: { 
      top: 28, 
      right: 12, 
      bottom: 42, 
      left: 52,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      confine: true,
      formatter: (p: any) =>
        `${p[0].axisValue}<br/>${p[0].marker} ${p[0].value}${unit}`,
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: {
        rotate: 30,
        fontSize: 11,
        color: '#71717a',
        hideOverlap: true,
        margin: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (v: number) => `${v}${unit}`,
        fontSize: 11,
        color: '#71717a',
        hideOverlap: true,
      },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barMaxWidth: 28,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
    media: [
      { 
        query: { maxWidth: 480 }, 
        option: { 
          grid: { bottom: 72 } 
        } 
      }
    ]
  };
}

export function makePieOptions({
  data,
  unit = '',
  palette = ['#2563eb', '#06b6d4', '#f59e0b', '#10b981'],
}: {
  data: Array<{ name: string; value: number }>;
  unit?: string;
  palette?: string[];
}): EChartsOption {
  const total = data.reduce((s, d) => s + d.value, 0);
  return {
    color: palette,
    tooltip: {
      trigger: 'item',
      formatter: (p: any) =>
        `${p.marker} ${p.name}: <b>${p.value}${unit}</b> (${p.percent}%)`,
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 0,
      top: 'middle',
      textStyle: { fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: { length: 12, length2: 8 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold' },
        },
        data,
      },
    ],
  };
}

export function makeGaugeOptions({
  value,
  unit = '%',
  max = 100,
}: {
  value: number;
  unit?: string;
  max?: number;
}): EChartsOption {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.7, '#10b981'],
              [0.9, '#f59e0b'],
              [1, '#ef4444'],
            ],
          },
        },
        pointer: { icon: 'circle', width: 6, length: '60%' },
        axisLabel: { fontSize: 11, color: '#71717a' },
        splitLine: { length: 10 },
        detail: {
          formatter: `{value}${unit}`,
          fontSize: 24,
          fontWeight: 700,
          offsetCenter: [0, '70%'],
        },
        data: [{ value }],
      },
    ],
  };
}

export function makeHeatmapOptions({
  xLabels,
  yLabels,
  values,
}: {
  xLabels: string[];
  yLabels: string[];
  values: Array<{ x: string; y: string; value: number }>;
}): EChartsOption {
  const data = values.map(({ x, y, value }) => [
    xLabels.indexOf(x),
    yLabels.indexOf(y),
    value,
  ]);
  const vals = values.map((v) => v.value);
  const min = vals.length ? Math.min(...vals) : 0;
  const max = vals.length ? Math.max(...vals) : 100;

  return {
    grid: { 
      top: 24, 
      right: 56, 
      bottom: 56, 
      left: 56,
      containLabel: true
    },
    tooltip: { position: 'top' },
    xAxis: {
      type: 'category',
      data: xLabels,
      splitArea: { show: true },
      axisLabel: { 
        fontSize: 11, 
        color: '#71717a',
        rotate: 30,
        margin: 12
      },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      splitArea: { show: true },
      axisLabel: { fontSize: 11, color: '#71717a' },
    },
    visualMap: {
      min,
      max,
      orient: 'vertical',
      right: 0,
      top: 'center',
      calculable: true,
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 10 },
      },
    ],
    media: [
      { 
        query: { maxWidth: 480 }, 
        option: { 
          grid: { bottom: 72 } 
        } 
      }
    ]
  };
}
