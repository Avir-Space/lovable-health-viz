import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiRange = '1D'|'1W'|'2W'|'1M'|'6M'|'1Y';

export type KpiVariant =
  | 'line'|'gauge'|'numeric'|'sparkline'|'delta'
  | 'bar'|'column'|'pie'
  | 'table'|'heatmap';

export interface KpiMeta {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  unit?: string;
  x_axis?: string;
  y_axis?: string;
  dashboard?: string;
  config?: any;
}

export interface KpiPayload {
  meta?: KpiMeta | null;
  timeseries?: Array<{ ts?: string; bucket?: string; series?: string; value: number }>;
  categories?: Array<{ category: string; series?: string|null; value: number }>;
  tableRows?: Array<Record<string, any>>;
  heatmap?: Array<{ x: string; y: string; value: number }>;
  latest?: any;
  generated_at?: string;
}

async function fetchKpiPayload(kpiKey: string, range: KpiRange): Promise<KpiPayload> {
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    p_kpi_key: kpiKey,
    p_range: range,
  });
  if (error) {
    console.error('[KPI RPC error]', kpiKey, range, error);
    throw error;
  }
  return (data as unknown as KpiPayload) ?? {};
}

export function useKpiData(kpiKey?: string, range: KpiRange = '1M', enabled = true) {
  const key = enabled && kpiKey ? ['kpi', kpiKey, range] as const : null;
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => fetchKpiPayload(kpiKey!, range),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  return {
    payload: data,
    isLoading,
    isValidating,
    error,
    refresh: () => mutate(),
  };
}

async function fetchDashboardKpis(dashboard: string): Promise<KpiMeta[]> {
  const { data, error } = await supabase
    .from('kpi_meta')
    .select('kpi_key, name, variant, unit, x_axis, y_axis, dashboard, config')
    .eq('dashboard', dashboard)
    .order('name', { ascending: true });

  if (error) {
    console.error('[kpi_meta fetch error]', dashboard, error);
    throw error;
  }
  return (data ?? []) as KpiMeta[];
}

export function useDashboardKpis(dashboard: string) {
  const key = ['kpi_meta', dashboard] as const;
  const { data, error, isLoading } = useSWR(key, () => fetchDashboardKpis(dashboard), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  return { kpis: data ?? [], error, isLoading };
}
