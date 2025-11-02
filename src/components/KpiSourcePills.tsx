import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type KpiSourcePillsProps = { 
  kpiKey: string;
};

// In-memory cache to avoid redundant queries
const cache = new Map<string, string[]>();

export function KpiSourcePills({ kpiKey }: KpiSourcePillsProps) {
  const [sources, setSources] = useState<string[] | null>(cache.get(kpiKey) ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSources() {
      // Return cached if available
      if (cache.has(kpiKey)) {
        setSources(cache.get(kpiKey)!);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('kpi_meta')
          .select('config')
          .eq('kpi_key', kpiKey)
          .maybeSingle();

        if (error) throw error;
        if (!data?.config) {
          cache.set(kpiKey, []);
          if (mounted) setSources([]);
          return;
        }

        const config = data.config as any;
        let sourcesList: string[] = [];

        // Try to get sources array first
        if (config.sources && Array.isArray(config.sources)) {
          sourcesList = config.sources;
        } 
        // Fallback to product_source
        else if (config.product_source && typeof config.product_source === 'string') {
          sourcesList = [config.product_source];
        }

        // De-duplicate and trim
        const uniq = Array.from(
          new Set(sourcesList.map((s: string) => s.trim()).filter(Boolean))
        );

        cache.set(kpiKey, uniq);
        if (mounted) setSources(uniq);
      } catch (e: any) {
        console.warn('[KpiSourcePills] Failed to load sources for', kpiKey, e);
        if (mounted) setError('load-failed');
      }
    }

    fetchSources();
    return () => { mounted = false; };
  }, [kpiKey]);

  // Render nothing if error, no data, or empty sources
  if (error || !sources || sources.length === 0) return null;

  const getColor = (label: string): string => {
    const key = label.toLowerCase();
    switch (key) {
      case 'amos': return '#1F49B6';
      case 'trax': return '#E6A323';
      case 'sap': return '#32C365';
      case 'ramco': return '#B273F6';
      case 'aims': return '#D84969';
      case 'jeppesen': return '#1F49B6';
      default: return '#294BDB';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2.5 mb-1">
      {sources.map((label) => (
        <span
          key={label}
          style={{ backgroundColor: getColor(label) }}
          className="text-white text-xs font-semibold rounded-full px-3 py-1 shadow-sm select-none hover:brightness-90 transition-all"
          aria-label={`Source ${label}`}
          title={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
