import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactKpiCard } from '@/components/impact/ImpactKpiCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type ImpactContext = 'my' | 'overall';

interface KpiRegistry {
  kpi_key: string;
  name: string;
  unit?: string;
  product_sources?: string[];
  action_title?: string;
  action_cta_label?: string;
}

export default function Impact() {
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [kpis, setKpis] = useState<KpiRegistry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [activeTab, userId]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('v_impact_card_registry' as any)
        .select('kpi_key, name, unit, product_sources, action_title, action_cta_label')
        .order('name', { ascending: true });

      if (error) throw error;

      // Filter KPIs that have timeseries data for the active context
      const kpisWithData = await Promise.all(
        (data || []).map(async (kpi: any) => {
          const query = supabase
            .from('impact_timeseries' as any)
            .select('id', { count: 'exact', head: true })
            .eq('kpi_key', kpi.kpi_key)
            .eq('context', activeTab)
            .limit(1);

          if (activeTab === 'my' && userId) {
            query.eq('user_id', userId);
          }

          const { count } = await query;
          return count && count > 0 ? kpi : null;
        })
      );

      setKpis(kpisWithData.filter(Boolean) as KpiRegistry[]);
    } catch (error: any) {
      console.error('[Impact] Error fetching KPIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Impact Analysis</h1>
        <p className="text-muted-foreground">
          View operational impact of AI-driven interventions across all modules
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImpactContext)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my">My Impact</TabsTrigger>
          <TabsTrigger value="overall">Overall Impact</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-2 h-8 w-8" />
              <span className="text-muted-foreground">Loading impact data...</span>
            </div>
          ) : kpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No impact data available for this view
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kpis.map((kpi) => (
                <ImpactKpiCard
                  key={kpi.kpi_key}
                  kpi_key={kpi.kpi_key}
                  name={kpi.name}
                  unit={kpi.unit}
                  product_sources={kpi.product_sources}
                  action_title={kpi.action_title}
                  action_cta_label={kpi.action_cta_label}
                  context={activeTab}
                  userId={activeTab === 'my' ? userId : null}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
