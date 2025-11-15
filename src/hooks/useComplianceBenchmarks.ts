import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const COMPLIANCE_KPI_KEYS = [
  'compliance-airworthiness:ad_compliance_rate',
  'compliance-airworthiness:sb_compliance_rate',
  'compliance-airworthiness:mel_compliance_status',
  'compliance-airworthiness:deferred_defects_aging',
  'compliance-airworthiness:safety_occurrences_rate',
  'compliance-airworthiness:occurrence_reporting_latency',
  'compliance-airworthiness:audit_findings_closure_rate',
  'compliance-airworthiness:audit_findings_trend',
  'compliance-airworthiness:regulatory_document_currency',
  'compliance-airworthiness:internal_audit_coverage_pct',
  'compliance-airworthiness:crew_duty_time_compliance_pct',
  'compliance-airworthiness:aircraft_airworthy_vs_grounded_pct',
] as const;

export type ComplianceBenchmark = {
  kpi_key: string;
  current_value: number;
  last_period_value: number;
  unit: string;
  target_band: string;
  ai_summary_text: string;
  ai_recommendation_title: string;
  ai_recommendation_cta_label: string;
  updated_at: string;
};

export function useComplianceBenchmarks() {
  const [data, setData] = useState<Record<string, ComplianceBenchmark>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { data: rows, error } = await (supabase as any)
          .from('compliance_kpi_benchmarks')
          .select('*')
          .in('kpi_key', COMPLIANCE_KPI_KEYS);

        if (!cancelled && !error && rows) {
          const map: Record<string, ComplianceBenchmark> = {};
          for (const row of rows) {
            map[row.kpi_key] = row as ComplianceBenchmark;
          }
          setData(map);
        }
      } catch (err) {
        console.error('[useComplianceBenchmarks] Error loading benchmarks:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { benchmarks: data, loading };
}
