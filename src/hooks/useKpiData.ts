import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import type { KpiPayload, KpiRange } from '@/types/kpi';

async function fetchKpiPayload(kpiKey: string, range: KpiRange): Promise<KpiPayload> {
  const { data, error } = await supabase.rpc('get_kpi_payload', {
    kpi_key: kpiKey,
    range_tag: range
  });
  if (error) {
    console.error('[KPI] RPC failed', kpiKey, range, error);
    throw new Error('Failed to load KPI');
  }
  return data ? (data as unknown as KpiPayload) : ({} as KpiPayload);
}

export function useKpiData(kpiKey: string, range: KpiRange = '1M', enabled = true) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    enabled && kpiKey ? ['kpi', kpiKey, range] : null,
    () => fetchKpiPayload(kpiKey, range),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000
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

export function useDashboardKpis(dashboardSlug: string) {
  const key = ['kpi-meta', dashboardSlug];
  const fetcher = async (): Promise<{ kpi_key: string }[]> => {
    const { data, error } = await supabase
      .from('kpi_meta')
      .select('kpi_key')
      .eq('dashboard', dashboardSlug)
      .order('kpi_key', { ascending: true });
    if (error) throw error;
    return data || [];
  };
  const { data, error, isLoading } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  return {
    kpis: data || [],
    isLoading,
    error,
  };
}
