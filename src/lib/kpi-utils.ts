export function normalizePercent(v?: number) {
  if (v == null || isNaN(v)) return 0;
  const x = v <= 1 ? v * 100 : v;
  return Math.max(0, Math.min(100, x));
}

export function formatXAxisDateLabel(s: string) {
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    }
  } catch {}
  return s;
}

export const KPI_RANGES = ['1D', '1W', '2W', '1M', '6M', '1Y'] as const;
export type KpiRange = typeof KPI_RANGES[number];

export const TIME_SERIES_VARIANTS = new Set(['line', 'gauge', 'numeric', 'sparkline', 'delta']);

export const KPI_CHART_HEIGHT = 300;
