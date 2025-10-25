import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import { KpiRange, KpiVariant, KpiPayloadRaw, KpiPayloadSafe, KpiMeta } from '@/types/kpi';
import { normalizeKpiPayload } from '@/utils/normalizeKpiPayload';

export type { KpiRange, KpiVariant };

async function fetchPayload(kpi_key: string, range: KpiRange): Promise<KpiPayloadSafe> {
  const { data, error } = await supabase.rpc('get_kpi_payload', { 
    kpi_key, 
    range_tag: range 
  });
  if (error) {
    console.error('[AVIR] RPC error for', kpi_key, error);
    throw error;
  }
  const raw = data as KpiPayloadRaw;
  const safe = normalizeKpiPayload(raw);
  if (!safe) throw new Error('Bad KPI payload');
  return safe;
}

export function useKpiData(kpi_key: string, variant: KpiVariant, range: KpiRange, enabled = true) {
  const key = enabled && kpi_key ? ['kpi', kpi_key, range] : null;
  const { data, error, isLoading, mutate } = useSWR(
    key, 
    () => fetchPayload(kpi_key, range), 
    {
      revalidateOnFocus: false, 
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
    }
  );
  
  return { 
    payload: data, 
    error, 
    isLoading, 
    refresh: () => mutate()
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
