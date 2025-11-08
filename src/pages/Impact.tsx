import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'my' && !userId) return;
    fetchKpis();
    setCurrentPage(1); // Reset to page 1 when switching tabs
  }, [activeTab, userId]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'my') {
        // Fetch user impact summaries
        const { data: summaries, error: summariesError } = await supabase
          .from('impact_summaries_user' as any)
          .select('*')
          .eq('user_id', userId);

        if (summariesError) throw summariesError;
        
        console.log('[Impact] My Impact user:', userId, 'summaries:', summaries);

        if (!summaries || summaries.length === 0) {
          setKpis([]);
          return;
        }

        // Fetch metadata for these KPIs
        const kpiKeys = summaries.map((s: any) => s.kpi_key);
        const { data: metaData, error: metaError } = await supabase
          .from('kpi_meta')
          .select('*')
          .in('kpi_key', kpiKeys);

        if (metaError) throw metaError;

        // Merge data
        const metaMap = new Map(metaData?.map((m: any) => [m.kpi_key, m]) || []);
        const formattedData = summaries
          .map((row: any) => {
            const meta = metaMap.get(row.kpi_key);
            if (!meta) return null;
            return {
              kpi_key: row.kpi_key,
              name: meta.name,
              variant: meta.variant,
              dashboard: meta.dashboard,
              config: meta.config,
              impact_value: row.impact_value,
              impact_unit: row.impact_unit,
              impact_summary: row.impact_summary,
              period: row.period,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => {
            if (a.dashboard !== b.dashboard) return a.dashboard.localeCompare(b.dashboard);
            return a.name.localeCompare(b.name);
          });
        
        setKpis(formattedData);
      } else {
        // Fetch overall impact summaries
        const { data: summaries, error: summariesError } = await supabase
          .from('impact_summaries_overall' as any)
          .select('*');

        if (summariesError) throw summariesError;
        
        console.log('[Impact] Overall Impact summaries:', summaries);

        if (!summaries || summaries.length === 0) {
          setKpis([]);
          return;
        }

        // Fetch metadata for these KPIs
        const kpiKeys = summaries.map((s: any) => s.kpi_key);
        const { data: metaData, error: metaError } = await supabase
          .from('kpi_meta')
          .select('*')
          .in('kpi_key', kpiKeys);

        if (metaError) throw metaError;

        // Merge data
        const metaMap = new Map(metaData?.map((m: any) => [m.kpi_key, m]) || []);
        const formattedData = summaries
          .map((row: any) => {
            const meta = metaMap.get(row.kpi_key);
            if (!meta) return null;
            return {
              kpi_key: row.kpi_key,
              name: meta.name,
              variant: meta.variant,
              dashboard: meta.dashboard,
              config: meta.config,
              impact_value: row.impact_value,
              impact_unit: row.impact_unit,
              impact_summary: row.impact_summary,
              period: row.period,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => {
            if (a.dashboard !== b.dashboard) return a.dashboard.localeCompare(b.dashboard);
            return a.name.localeCompare(b.name);
          });
        
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((kpi) => (
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
              
              {kpis.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {currentPage} of {Math.ceil(kpis.length / itemsPerPage)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(kpis.length / itemsPerPage), p + 1))}
                    disabled={currentPage === Math.ceil(kpis.length / itemsPerPage)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
