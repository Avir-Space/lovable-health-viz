import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TARGET_KPIS = [
  'impact:aog_minutes_avoided',
  'impact:fuel_saved_kg',
  'impact:cost_saved_usd',
];

interface ImpactTimeseriesRow {
  kpi_key: string;
  ts: string;
  bucket: string;
  series: string;
  value: number;
}

export interface ImpactOverallKpi {
  kpi_key: string;
  timeseries: Array<{ ts: string; value: number }>;
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

      // Query v_impact_overall_timeseries for our 3 target KPIs
      // Cast to any because this is a view not in generated types
      const { data, error: queryError } = await (supabase as any)
        .from('v_impact_overall_timeseries')
        .select('kpi_key, ts, bucket, series, value')
        .in('kpi_key', TARGET_KPIS)
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

      // Convert to our result format, only including KPIs with data
      const result: ImpactOverallKpi[] = TARGET_KPIS
        .filter((kpi_key) => grouped.has(kpi_key) && grouped.get(kpi_key)!.length > 0)
        .map((kpi_key) => ({
          kpi_key,
          timeseries: grouped.get(kpi_key)!.map((row) => ({
            ts: row.ts,
            value: row.value,
          })),
        }));

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
