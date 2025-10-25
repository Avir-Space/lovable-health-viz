import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiRange = '1D' | '1W' | '2W' | '1M' | '6M' | '1Y';

export type KpiVariant = 'line' | 'bar' | 'pie' | 'gauge' | 'heatmap' | 'table' | 'numeric' | 'dualAxis';

export interface KpiMeta {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  x_axis?: string | null;
  y_axis?: string | null;
  unit?: string | null;
  dashboard?: string | null;
  config?: any;
}

export interface KpiPayload {
  meta: KpiMeta;
  latest: { value?: number | null } | null;
  timeseries?: Array<{ ts?: string | null; bucket?: string | null; series?: string | null; value: number | null }>;
  categories?: Array<{ category: string; value: number | null; series?: string | null }>;
  heatmap?: Array<{ x: string; y: string; value: number | null }>;
  tableRows?: any[];
  generated_at?: string;
}

async function fetchPayload(kpiKey: string, range: KpiRange): Promise<KpiPayload> {
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    kpi_key: kpiKey,
    range_tag: range,
  });
  if (error) {
    console.error('[AVIR] RPC error for', kpiKey, error);
    throw error;
  }
  return data as unknown as KpiPayload;
}

/** tiny mock so the UI never collapses during a demo */
function mockPayload(k: string, v: KpiVariant, range: KpiRange): KpiPayload {
  const now = new Date();
  const ts = [...Array(24)].map((_, i) => {
    const d = new Date(now.getTime() - (23 - i) * 3600 * 1000);
    return { ts: d.toISOString(), value: Math.round(50 + Math.sin(i / 3) * 25) };
  });
  const cats = ['Category 1', 'Category 2', 'Category 3', 'Category 4'].map((c, i) => ({
    category: c,
    value: 40 + i * 15,
  }));
  return {
    meta: { kpi_key: k, name: k.split(':').pop() || k, variant: v, unit: v === 'gauge' ? '%' : undefined },
    latest: { value: v === 'gauge' || v === 'numeric' ? 72 : null },
    timeseries: v === 'line' || v === 'numeric' || v === 'gauge' ? ts : [],
    categories: v === 'bar' || v === 'pie' ? cats : [],
    heatmap: v === 'heatmap' ? [{ x: 'Bucket 1', y: 'Class 1', value: 83 }] : [],
    tableRows: v === 'table' ? [{ Name: 'Row 1', Metric: 123, UpdatedAt: new Date().toISOString() }] : [],
    generated_at: now.toISOString(),
  };
}

export function useKpiData(kpiKey: string, variant: KpiVariant, range: KpiRange, enabled = true) {
  const swr = useSWR(
    enabled && kpiKey ? ['kpi', kpiKey, range] : null,
    () => fetchPayload(kpiKey, range),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 2,
    }
  );

  // Graceful fallback if RPC fails or returns empty structures
  const payload: KpiPayload | undefined =
    (swr.data as any)?.meta ? swr.data : mockPayload(kpiKey, variant, range);

  const refresh = async () => {
    await swr.mutate();
  };

  return {
    payload,
    isLoading: !swr.error && !swr.data,
    isValidating: swr.isValidating,
    error: swr.error,
    refresh,
  };
}

/** fetch meta for dashboard (already seeded in kpi_meta) */
export function useDashboardKpis(dashboardKey: string) {
  const { data, error, isLoading } = useSWR(['kpi_meta', dashboardKey], async () => {
    const { data, error } = await supabase
      .from('kpi_meta')
      .select('kpi_key,name,variant,x_axis,y_axis,unit,config')
      .eq('dashboard', dashboardKey)
      .order('kpi_key', { ascending: true });
    if (error) throw error;
    return data as KpiMeta[];
  }, { revalidateOnFocus: false });
  return { kpis: data || [], error, isLoading };
}
