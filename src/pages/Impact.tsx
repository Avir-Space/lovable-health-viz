import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactKpiCard } from '@/components/impact/ImpactKpiCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type ImpactContext = 'my' | 'overall';

interface ImpactKpiData {
  kpi_key: string;
  name: string;
  variant: string;
  dashboard: string;
  config: any;
  impact_value?: number;
  impact_unit?: string;
  impact_summary?: string;
  period?: string;
}

export default function Impact() {
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [kpis, setKpis] = useState<ImpactKpiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'my' && !userId) return;
    fetchKpis();
  }, [activeTab, userId]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      let query;
      
      if (activeTab === 'my') {
        const { data, error } = await supabase
          .from('impact_summaries_user' as any)
          .select(`
            kpi_key,
            impact_value,
            impact_unit,
            impact_summary,
            period,
            kpi_meta!inner(name, variant, dashboard, config)
          `)
          .eq('user_id', userId)
          .order('kpi_meta(dashboard)', { ascending: true })
          .order('kpi_meta(name)', { ascending: true });

        if (error) throw error;
        
        const formattedData = (data || []).map((row: any) => ({
          kpi_key: row.kpi_key,
          name: row.kpi_meta.name,
          variant: row.kpi_meta.variant,
          dashboard: row.kpi_meta.dashboard,
          config: row.kpi_meta.config,
          impact_value: row.impact_value,
          impact_unit: row.impact_unit,
          impact_summary: row.impact_summary,
          period: row.period,
        }));
        
        setKpis(formattedData);
      } else {
        const { data, error } = await supabase
          .from('impact_summaries_overall' as any)
          .select(`
            kpi_key,
            impact_value,
            impact_unit,
            impact_summary,
            period,
            kpi_meta!inner(name, variant, dashboard, config)
          `)
          .order('kpi_meta(dashboard)', { ascending: true })
          .order('kpi_meta(name)', { ascending: true });

        if (error) throw error;
        
        const formattedData = (data || []).map((row: any) => ({
          kpi_key: row.kpi_key,
          name: row.kpi_meta.name,
          variant: row.kpi_meta.variant,
          dashboard: row.kpi_meta.dashboard,
          config: row.kpi_meta.config,
          impact_value: row.impact_value,
          impact_unit: row.impact_unit,
          impact_summary: row.impact_summary,
          period: row.period,
        }));
        
        setKpis(formattedData);
      }
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
                  variant={kpi.variant}
                  dashboard={kpi.dashboard}
                  config={kpi.config}
                  impact_value={kpi.impact_value}
                  impact_unit={kpi.impact_unit}
                  impact_summary={kpi.impact_summary}
                  period={kpi.period}
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
