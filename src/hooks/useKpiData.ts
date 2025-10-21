import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiRange = '1D' | '1W' | '2W' | '1M' | '6M' | '1Y';

interface KpiPayload {
  kpi_key: string;
  name: string;
  variant: string;
  xAxis?: string;
  yAxis?: string;
  unit?: string;
  config?: any;
  data?: any[];
  rows?: any[];
}

const fetchKpiPayload = async (kpiKey: string, range: KpiRange): Promise<KpiPayload | null> => {
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    p_kpi_key: kpiKey,
    p_range: range
  });

  if (error) {
    console.error('Error fetching KPI:', error);
    throw error;
  }

  return data as unknown as KpiPayload;
};

export function useKpiData(kpiKey: string, range: KpiRange = '1M') {
  const { data, error, isLoading, mutate } = useSWR(
    kpiKey ? ['kpi', kpiKey, range] : null,
    () => fetchKpiPayload(kpiKey, range),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 60 second deduplication
    }
  );

  const refresh = async () => {
    return mutate();
  };

  return {
    payload: data,
    isLoading,
    error,
    refresh,
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
