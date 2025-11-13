import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const IMPACT_META: Record<string, { label: string; unit: string }> = {
  'impact:aog_minutes_avoided': {
    label: 'AOG Minutes Avoided',
    unit: 'minutes',
  },
  'impact:fuel_saved_kg': {
    label: 'Fuel Saved',
    unit: 'kg',
  },
  'impact:cost_saved_usd': {
    label: 'Cost Saved',
    unit: 'USD',
  },
  'impact:tech_delay_minutes': {
    label: 'Tech Delay Minutes',
    unit: 'minutes',
  },
  'impact:non_tech_delay_minutes': {
    label: 'Non-tech Delay Minutes',
    unit: 'minutes',
  },
  'impact:grounded_due_to_spares': {
    label: 'Grounded due to Spares',
    unit: 'aircraft',
  },
  'impact:crew_overtime_hours': {
    label: 'Crew Overtime Hours',
    unit: 'hours',
  },
  'impact:warranty_recovery_rate': {
    label: 'Warranty Recovery Rate',
    unit: '%',
  },
};

interface ImpactTimeseriesRow {
  kpi_key: string;
  ts: string;
  bucket: string;
  series: string;
  value: number;
}

export interface ImpactOverallKpi {
  kpi_key: string;
  label: string;
  unit: string;
  timeseries: Array<{ ts: string; value: number }>;
  latestValue?: number;
}

interface UseImpactOverallResult {
  kpis: ImpactOverallKpi[];
  isLoading: boolean;
  error: string | null;
}

export function useImpactOverall(selectedBucket: string = '30d'): UseImpactOverallResult {
  const [kpis, setKpis] = useState<ImpactOverallKpi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImpactOverall();
  }, [selectedBucket]);

  const fetchImpactOverall = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Query v_impact_overall_timeseries for all KPIs
      // Cast to any because this is a view not in generated types
      const { data, error: queryError } = await (supabase as any)
        .from('v_impact_overall_timeseries')
        .select('kpi_key, ts, bucket, series, value')
        .eq('bucket', selectedBucket)
        .eq('series', 'impact')
        .order('ts', { ascending: true }) as { data: ImpactTimeseriesRow[] | null; error: any };

      if (queryError) {
        // Gracefully handle errors - log but don't crash
        console.warn('[Impact Overall] Query error:', queryError);
        
        // If it's a missing column or table error, just return empty
        if (queryError.code === '42703' || queryError.message?.includes('does not exist')) {
          setKpis([]);
          setIsLoading(false);
          return;
        }
        
        setError(queryError.message);
        setKpis([]);
        setIsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setKpis([]);
        setIsLoading(false);
        return;
      }

      // Group by kpi_key
      const grouped = new Map<string, ImpactTimeseriesRow[]>();
      
      data.forEach((row) => {
        if (!grouped.has(row.kpi_key)) {
          grouped.set(row.kpi_key, []);
        }
        grouped.get(row.kpi_key)!.push(row);
      });

      // Convert to our result format, only including KPIs that are in our metadata map
      const result: ImpactOverallKpi[] = Array.from(grouped.keys())
        .filter((kpi_key) => IMPACT_META[kpi_key] && grouped.get(kpi_key)!.length > 0)
        .map((kpi_key) => {
          const rows = grouped.get(kpi_key)!;
          const sortedRows = rows.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
          const timeseries = sortedRows.map((row) => ({
            ts: row.ts,
            value: row.value,
          }));
          const latestValue = sortedRows[sortedRows.length - 1]?.value;
          
          return {
            kpi_key,
            label: IMPACT_META[kpi_key].label,
            unit: IMPACT_META[kpi_key].unit,
            timeseries,
            latestValue,
          };
        });

      setKpis(result);
      setIsLoading(false);
    } catch (err: any) {
      console.error('[Impact Overall] Unexpected error:', err);
      setError(err.message || 'Unknown error');
      setKpis([]);
      setIsLoading(false);
    }
  };

  return { kpis, isLoading, error };
}
