import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import type { KpiRange } from '@/lib/kpi-utils';

export interface KpiMeta {
  kpi_key: string;
  dashboard: string;
  name: string;
  variant: 'line' | 'gauge' | 'numeric' | 'delta' | 'sparkline' | 'timeline' | 'bar' | 'column' | 'pie' | 'heatmap' | 'table';
  unit?: string;
  x_axis?: string;
  y_axis?: string;
  config?: {
    dualAxis?: {
      seriesMap: Record<string, 0 | 1>;
      rightAxisName?: string;
      rightAxisUnit?: string;
    };
    [key: string]: any;
  };
}

export interface KpiPayload {
  kpi_key: string;
  name: string;
  variant: string;
  xAxis?: string;
  yAxis?: string;
  unit?: string;
  config?: {
    dualAxis?: {
      seriesMap: Record<string, 0 | 1>;
      rightAxisName?: string;
      rightAxisUnit?: string;
    };
    [key: string]: any;
  };
  data?: Array<{
    bucket?: string;
    ts?: string;
    category?: string;
    series?: string;
    value: number;
    x?: string;
    y?: string;
  }>;
  rows?: any[];
  generated_at?: string;
}

const fetchKpiPayload = async (kpiKey: string, range: KpiRange): Promise<KpiPayload | null> => {
  if (!kpiKey) return null;
  
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    p_kpi_key: kpiKey,
    p_range: range
  });

  if (error) {
    console.error('[KPI] Fetch failed:', error);
    throw new Error('Failed to load KPI data');
  }

  if (!data) return null;
  
  const payload = data as any;
  return {
    ...payload,
    generated_at: payload?.generated_at ?? new Date().toISOString()
  } as KpiPayload;
};

export function useKpiData(kpiKey: string, range: KpiRange = '1M', enabled: boolean = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    enabled && kpiKey ? ['kpi', kpiKey, range] as const : null,
    ([, k, r]) => fetchKpiPayload(k, r),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      keepPreviousData: true,
    }
  );

  return {
    payload: data ?? null,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}

export function useDashboardKpis(dashboard: string) {
  const { data, error, isLoading } = useSWR(
    dashboard ? ['dashboard-kpis', dashboard] : null,
    async () => {
      const { data, error } = await supabase
        .from('kpi_meta')
        .select('kpi_key, dashboard, name, variant, x_axis, y_axis, unit, config')
        .eq('dashboard', dashboard)
        .order('kpi_key');

      if (error) throw error;
      if (!data || data.length === 0) {
        console.warn(`[kpi_meta] No KPIs found for dashboard: ${dashboard}`);
      }
      return data as KpiMeta[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    kpis: data || [],
    isLoading,
    error,
  };
}
