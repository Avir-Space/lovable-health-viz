import {
  KpiPayloadRaw, KpiPayloadSafe,
  TimeseriesPoint, CategoryPoint, HeatmapPoint, TableRow
} from '@/types/kpi';

const num = (v:any) => (typeof v === 'number' ? v : Number(v) || 0);
const str = (v:any) => (v == null ? '' : String(v));

export function normalizeKpiPayload(raw?: KpiPayloadRaw | null): KpiPayloadSafe | null {
  if (!raw || !raw.meta) return null;

  const safe: KpiPayloadSafe = {
    meta: raw.meta,
    generated_at: raw.generated_at,
    latest: raw.latest && typeof raw.latest.value !== 'undefined'
      ? { value: num(raw.latest.value) }
      : null,
    timeseries: [],
    categories: [],
    heatmap: [],
    tableRows: []
  };

  if (Array.isArray(raw.timeseries)) {
    safe.timeseries = raw.timeseries.map((r:any): TimeseriesPoint => ({
      ts: r.ts ?? undefined,
      bucket: r.bucket ?? undefined,
      series: r.series ?? undefined,
      value: num(r.value)
    }));
  }

  if (Array.isArray(raw.categories)) {
    safe.categories = raw.categories.map((r:any): CategoryPoint => ({
      category: str(r.category ?? r.name ?? r.label ?? ''),
      value: num(r.value)
    })).filter(p => p.category !== '');
  }

  if (Array.isArray(raw.heatmap)) {
    safe.heatmap = raw.heatmap.map((r:any): HeatmapPoint => ({
      x: str(r.x),
      y: str(r.y),
      value: num(r.value)
    }));
  }

  if (Array.isArray(raw.tableRows)) {
    safe.tableRows = raw.tableRows.map((r:any): TableRow => {
      const out: TableRow = {};
      Object.keys(r || {}).forEach(k => {
        const v = r[k];
        if (v == null) out[k] = null;
        else if (typeof v === 'number') out[k] = v;
        else if (typeof v === 'string') out[k] = v;
        else out[k] = JSON.stringify(v); // LAST resort – never raw object
      });
      return out;
    });
  }

  return safe;
}
