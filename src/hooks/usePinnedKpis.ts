import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PinnedKpi {
  kpi_key: string;
  source_dashboard: string;
  sort_order: number;
}

interface UsePinnedKpisReturn {
  pinned: Record<string, string>;
  pinnedList: PinnedKpi[];
  isLoading: boolean;
  isPinned: (kpi_key: string) => boolean;
  pin: (kpi_key: string, source_dashboard: string) => Promise<void>;
  unpin: (kpi_key: string, source_dashboard: string) => Promise<void>;
}

export function usePinnedKpis(): UsePinnedKpisReturn {
  const [pinnedList, setPinnedList] = useState<PinnedKpi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPinned = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('pinned_kpis')
        .select('kpi_key, source_dashboard, sort_order')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPinnedList((data || []) as PinnedKpi[]);
    } catch (error) {
      console.error('[usePinnedKpis] Error loading pins:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPinned();
  }, [loadPinned]);

  const pinned = pinnedList.reduce((acc, item) => {
    acc[item.kpi_key] = item.source_dashboard;
    return acc;
  }, {} as Record<string, string>);

  const isPinned = useCallback(
    (kpi_key: string) => {
      return kpi_key in pinned;
    },
    [pinned]
  );

  const pin = useCallback(
    async (kpi_key: string, source_dashboard: string) => {
      // Optimistic update
      setPinnedList((prev) => [...prev, { kpi_key, source_dashboard, sort_order: 0 }]);

      try {
        const { error } = await (supabase as any).from('pinned_kpis').insert([
          {
            kpi_key,
            source_dashboard,
          },
        ]);

        if (error) throw error;
        
        // Reload to get correct sort_order
        await loadPinned();
        toast.success('KPI pinned to My Dashboard');
      } catch (error) {
        console.error('[usePinnedKpis] Error pinning:', error);
        toast.error('Failed to pin KPI');
        // Revert optimistic update
        setPinnedList((prev) => prev.filter((p) => p.kpi_key !== kpi_key));
      }
    },
    [loadPinned]
  );

  const unpin = useCallback(
    async (kpi_key: string, source_dashboard: string) => {
      // Optimistic update
      setPinnedList((prev) => prev.filter((p) => p.kpi_key !== kpi_key));

      try {
        const { error } = await (supabase as any)
          .from('pinned_kpis')
          .delete()
          .eq('kpi_key', kpi_key)
          .eq('source_dashboard', source_dashboard);

        if (error) throw error;
        
        toast.success('KPI unpinned');
      } catch (error) {
        console.error('[usePinnedKpis] Error unpinning:', error);
        toast.error('Failed to unpin KPI');
        // Revert optimistic update
        setPinnedList((prev) => [...prev, { kpi_key, source_dashboard, sort_order: 0 }]);
      }
    },
    []
  );

  return {
    pinned,
    pinnedList,
    isLoading,
    isPinned,
    pin,
    unpin,
  };
}
