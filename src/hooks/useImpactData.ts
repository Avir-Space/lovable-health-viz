import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KpiRange } from './useKpiData';

type ImpactContext = 'my' | 'overall';

// All fields are optional to handle missing columns gracefully
export interface ImpactRegistryCard {
  kpi_key: string;
  dashboard?: string;
  name: string;
  unit?: string;
  chart_variant?: string;
  product_sources?: string[];
  time_variants?: string[];
}

export interface ImpactTimeseries {
  kpi_key: string;
  value: number;
  bucket?: string;
  ts?: string;
}

export interface ImpactSummary {
  kpi_key: string;
  impact_value?: number;
  impact_unit?: string;
  summary?: string;
  summary_text?: string;
  confidence_pct?: number;
  period?: string;
  period_end?: string;
}

export interface ImpactKpiViewModel {
  kpi_key: string;
  name: string;
  unit?: string;
  chart_variant?: string;
  product_sources?: string[];
  impact_value: number;
  impact_unit?: string;
  summary?: string;
  confidence_pct?: number;
  timeseries?: ImpactTimeseries[];
  hasData: boolean;
}

interface ImpactDataResult {
  myImpactCards: ImpactKpiViewModel[];
  overallImpactCards: ImpactKpiViewModel[];
  isLoading: boolean;
  error: string | null;
}

const PERIOD_TO_BUCKET: Record<KpiRange, string> = {
  '1D': '1D',
  '1W': '1W',
  '2W': '2W',
  '1M': '30d',
  '6M': '6M',
  '1Y': '1Y',
};

/**
 * Safely fetches data from a Supabase table, handling missing columns (42703) gracefully
 */
async function safeFetch<T = any>(
  tableName: string,
  selectColumns: string,
  filters: { [key: string]: any } = {}
): Promise<{ data: T[] | null; error: any; columnsMissing: boolean }> {
  try {
    // Cast to any to allow dynamic table names
    let query: any = (supabase as any).from(tableName).select(selectColumns);
    
    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (key === 'order') {
        const [col, dir] = String(value).split(':');
        query = query.order(col, { ascending: dir === 'asc' });
      } else if (key !== 'order') {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query;

    if (error) {
      // Check for missing column error (PostgreSQL error code 42703)
      if (error.code === '42703' || error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.warn(`[Impact] Missing column in ${tableName}:`, error.message);
        return { data: null, error, columnsMissing: true };
      }
      
      // Check for missing table/view error
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.warn(`[Impact] Table/view ${tableName} does not exist:`, error.message);
        return { data: null, error, columnsMissing: false };
      }
      
      console.warn(`[Impact] Query error for ${tableName}:`, error);
      return { data: null, error, columnsMissing: false };
    }

    return { data: data as T[], error: null, columnsMissing: false };
  } catch (err: any) {
    console.warn(`[Impact] Unexpected error fetching ${tableName}:`, err);
    return { data: null, error: err, columnsMissing: false };
  }
}

/**
 * Robust hook for fetching Impact data with graceful error handling
 * - Handles missing columns (42703 errors)
 * - Handles missing tables/views
 * - Supports partial data rendering
 * - Never crashes the UI
 */
export function useImpactData(selectedPeriod: KpiRange, userId: string | undefined) {
  const [result, setResult] = useState<ImpactDataResult>({
    myImpactCards: [],
    overallImpactCards: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setResult({
        myImpactCards: [],
        overallImpactCards: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    fetchImpactData();
  }, [selectedPeriod, userId]);

  const fetchImpactData = async () => {
    if (!userId) return;

    setResult(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const bucket = PERIOD_TO_BUCKET[selectedPeriod];

      // Step 1: Fetch registry (minimal required columns only)
      const { data: registry, error: registryError, columnsMissing: registryColsMissing } = 
        await safeFetch<ImpactRegistryCard>(
          'v_impact_card_registry',
          'kpi_key, name, dashboard, unit, chart_variant, product_sources, time_variants',
          { order: 'name:asc' }
        );

      if (registryError && !registryColsMissing) {
        // Table doesn't exist or serious error - show empty state
        console.warn('[Impact] Registry unavailable, showing empty state');
        setResult({
          myImpactCards: [],
          overallImpactCards: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      // If we have no registry at all, we can't show anything
      if (!registry || registry.length === 0) {
        setResult({
          myImpactCards: [],
          overallImpactCards: [],
          isLoading: false,
          error: null,
        });
        return;
      }

      // Step 2: Fetch My Impact timeseries
      const { data: myTimeseries } = await safeFetch<ImpactTimeseries>(
        'impact_timeseries',
        'kpi_key, value, bucket, ts',
        {
          context: 'my',
          user_id: userId,
          series: 'impact',
          bucket: bucket,
          order: 'ts:desc',
        }
      );

      // Step 3: Fetch Overall Impact timeseries
      const { data: overallTimeseries } = await safeFetch<ImpactTimeseries>(
        'impact_timeseries',
        'kpi_key, value, bucket, ts',
        {
          context: 'overall',
          series: 'impact',
          bucket: bucket,
          order: 'ts:desc',
        }
      );

      // Step 4: Try to fetch summaries (these might not exist, that's OK)
      const { data: mySummaries } = await safeFetch<ImpactSummary>(
        'impact_ai_summaries',
        'kpi_key, impact_value, impact_unit, summary, summary_text, confidence_pct',
        {
          context: 'my',
          user_id: userId,
        }
      );

      const { data: overallSummaries } = await safeFetch<ImpactSummary>(
        'impact_ai_summaries',
        'kpi_key, impact_value, impact_unit, summary, summary_text, confidence_pct',
        {
          context: 'overall',
        }
      );

      // Step 5: Build data maps
      const myTimeseriesMap = new Map<string, ImpactTimeseries[]>();
      (myTimeseries || []).forEach(row => {
        if (!myTimeseriesMap.has(row.kpi_key)) {
          myTimeseriesMap.set(row.kpi_key, []);
        }
        myTimeseriesMap.get(row.kpi_key)!.push(row);
      });

      const overallTimeseriesMap = new Map<string, ImpactTimeseries[]>();
      (overallTimeseries || []).forEach(row => {
        if (!overallTimeseriesMap.has(row.kpi_key)) {
          overallTimeseriesMap.set(row.kpi_key, []);
        }
        overallTimeseriesMap.get(row.kpi_key)!.push(row);
      });

      const mySummaryMap = new Map<string, ImpactSummary>();
      (mySummaries || []).forEach(row => {
        mySummaryMap.set(row.kpi_key, row);
      });

      const overallSummaryMap = new Map<string, ImpactSummary>();
      (overallSummaries || []).forEach(row => {
        overallSummaryMap.set(row.kpi_key, row);
      });

      // Step 6: Build view models - only include KPIs with actual data
      const myCards: ImpactKpiViewModel[] = [];
      const overallCards: ImpactKpiViewModel[] = [];

      registry.forEach(card => {
        const kpiKey = card.kpi_key;

        // My Impact card
        const myTs = myTimeseriesMap.get(kpiKey) || [];
        const mySummary = mySummaryMap.get(kpiKey);
        const hasMyData = myTs.length > 0 || !!mySummary;

        if (hasMyData) {
          // Get latest value from timeseries or summary
          const latestValue = myTs.length > 0 
            ? myTs[0].value 
            : (mySummary?.impact_value ?? 0);

          myCards.push({
            kpi_key: kpiKey,
            name: card.name,
            unit: card.unit || mySummary?.impact_unit,
            chart_variant: card.chart_variant,
            product_sources: card.product_sources,
            impact_value: latestValue,
            impact_unit: mySummary?.impact_unit,
            summary: mySummary?.summary || mySummary?.summary_text,
            confidence_pct: mySummary?.confidence_pct,
            timeseries: myTs,
            hasData: true,
          });
        }

        // Overall Impact card
        const overallTs = overallTimeseriesMap.get(kpiKey) || [];
        const overallSummary = overallSummaryMap.get(kpiKey);
        const hasOverallData = overallTs.length > 0 || !!overallSummary;

        if (hasOverallData) {
          const latestValue = overallTs.length > 0 
            ? overallTs[0].value 
            : (overallSummary?.impact_value ?? 0);

          overallCards.push({
            kpi_key: kpiKey,
            name: card.name,
            unit: card.unit || overallSummary?.impact_unit,
            chart_variant: card.chart_variant,
            product_sources: card.product_sources,
            impact_value: latestValue,
            impact_unit: overallSummary?.impact_unit,
            summary: overallSummary?.summary || overallSummary?.summary_text,
            confidence_pct: overallSummary?.confidence_pct,
            timeseries: overallTs,
            hasData: true,
          });
        }
      });

      console.log('[Impact] Successfully loaded:', {
        registry: registry.length,
        myCards: myCards.length,
        overallCards: overallCards.length,
      });

      setResult({
        myImpactCards: myCards,
        overallImpactCards: overallCards,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('[Impact] Unexpected error:', error);
      // Even on error, don't crash - just show empty state
      setResult({
        myImpactCards: [],
        overallImpactCards: [],
        isLoading: false,
        error: null, // Don't show error to user, just log it
      });
    }
  };

  return result;
}
