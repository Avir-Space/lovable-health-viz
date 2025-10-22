import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiRange = '1D' | '1W' | '2W' | '1M' | '6M' | '1Y';

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
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    p_kpi_key: kpiKey,
    p_range: range
  });

  if (error) {
    console.error('[Internal] KPI fetch failed:', error);
    throw new Error('Failed to load dashboard data');
  }

  if (!data) return null;
  return {
    ...(data as object),
    generated_at: new Date().toISOString()
  } as KpiPayload;
};

export function useKpiData(kpiKey: string, range: KpiRange = '1M', enabled: boolean = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    enabled && kpiKey ? ['kpi', kpiKey, range] : null,
    () => fetchKpiPayload(kpiKey, range),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  return {
    payload: data,
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}

// Hook to fetch dashboard KPIs
export function useDashboardKpis(dashboard: string) {
  const { data, error, isLoading } = useSWR(
    dashboard ? ['dashboard-kpis', dashboard] : null,
    async () => {
      const { data, error } = await supabase
        .from('kpi_meta')
        .select('kpi_key, name, variant, x_axis, y_axis, unit, config')
        .eq('dashboard', dashboard)
        .order('kpi_key');

      if (error) throw error;
      return data;
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
