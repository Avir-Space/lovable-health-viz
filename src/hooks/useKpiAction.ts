import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';

export type KpiAction = {
  action_title: string;
  action_cta_label: string;
  why_this_action: string | null;
  evidence_section: string | null;
  impact_if_ignored: string | null;
  expected_gain: string | null;
};

async function fetchKpiAction(kpi_key: string): Promise<KpiAction | null> {
  try {
    const { data, error } = await supabase
      .from('kpi_actions' as any)
      .select('action_title, action_cta_label, why_this_action, evidence_section, impact_if_ignored, expected_gain')
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
      why_this_action: data.why_this_action,
      evidence_section: data.evidence_section,
      impact_if_ignored: data.impact_if_ignored,
      expected_gain: data.expected_gain,
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
