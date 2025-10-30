import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiAction = {
  action_title: string;
  action_cta_label: string;
};

async function fetchKpiAction(kpi_key: string): Promise<KpiAction | null> {
  try {
    const { data, error } = await supabase
      .from('kpi_actions' as any)
      .select('action_title, action_cta_label')
      .eq('kpi_key', kpi_key)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle() as any;

    if (error) {
      console.error('[AVIR] Error fetching kpi_action for', kpi_key, error);
      return null;
    }

    if (!data) return null;

    return {
      action_title: data.action_title,
      action_cta_label: data.action_cta_label,
    };
  } catch (err) {
    console.error('[AVIR] Exception fetching kpi_action for', kpi_key, err);
    return null;
  }
}

export function useKpiAction(kpi_key: string) {
  const { data, error } = useSWR(
    kpi_key ? ['kpi_action', kpi_key] : null,
    () => fetchKpiAction(kpi_key),
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour - cache per session
      shouldRetryOnError: false,
    }
  );

  return { action: data || null, error };
}
