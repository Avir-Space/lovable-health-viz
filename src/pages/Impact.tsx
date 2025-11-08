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
  product_sources: string[];
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
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    if (activeTab === 'my' && !userId) return;
    fetchKpis();
  }, [activeTab, userId, currentPage]);

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * PAGE_SIZE;

      // 1. Get paginated KPIs from impact_kpi_registry with count
      const { data: cardRegistry, error: registryError, count } = await supabase
        .from('impact_kpi_registry' as any)
        .select('kpi_key, dashboard, name, chart_variant, unit, time_variants, primary_source, product_sources, config', { count: 'exact' })
        .order('dashboard', { ascending: true })
        .order('name', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (registryError) {
        console.error('[Impact] Error loading registry:', registryError);
        setKpis([]);
        setTotalCount(0);
        return;
      }

      if (!cardRegistry || cardRegistry.length === 0) {
        console.warn('[Impact] No cards in impact_kpi_registry');
        setKpis([]);
        setTotalCount(0);
        return;
      }

      setTotalCount(count || 0);

      // 2. Get impact summaries based on active tab
      let summariesMap = new Map<string, any>();
      
      if (activeTab === 'my') {
        const { data: summaries, error: summariesError } = await supabase
          .from('impact_summaries_user' as any)
          .select('*')
          .eq('user_id', userId);

        if (summariesError) {
          console.warn('[Impact] Error fetching user summaries:', summariesError);
        } else {
          summaries?.forEach((s: any) => {
            summariesMap.set(s.kpi_key, s);
          });
        }
      } else {
        const { data: summaries, error: summariesError } = await supabase
          .from('impact_summaries_overall' as any)
          .select('*');

        if (summariesError) {
          console.warn('[Impact] Error fetching overall summaries:', summariesError);
        } else {
          summaries?.forEach((s: any) => {
            summariesMap.set(s.kpi_key, s);
          });
        }
      }

      // 3. Map registry cards with their impact summaries
      const formattedData = cardRegistry.map((card: any) => {
        const summary = summariesMap.get(card.kpi_key);
        const sources = card.product_sources || [];
        
        return {
          kpi_key: card.kpi_key,
          name: card.name,
          variant: card.chart_variant || 'line',
          dashboard: card.dashboard,
          config: card.config || {},
          product_sources: sources,
          impact_value: summary?.impact_value,
          impact_unit: summary?.impact_unit,
          impact_summary: summary?.impact_summary,
          period: summary?.period || '1M',
        };
      });

      setKpis(formattedData);
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
              Error loading impact registry or no cards configured
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpis.map((kpi) => (
                  <ImpactKpiCard
                    key={kpi.kpi_key}
                    kpi_key={kpi.kpi_key}
                    name={kpi.name}
                    variant={kpi.variant}
                    dashboard={kpi.dashboard}
                    config={kpi.config}
                    product_sources={kpi.product_sources}
                    impact_value={kpi.impact_value}
                    impact_unit={kpi.impact_unit}
                    impact_summary={kpi.impact_summary}
                    period={kpi.period}
                    context={activeTab}
                    userId={activeTab === 'my' ? userId : null}
                  />
                ))}
              </div>
              
              {totalCount > PAGE_SIZE && (
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
                    Page {currentPage} of {Math.ceil(totalCount / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / PAGE_SIZE), p + 1))}
                    disabled={currentPage === Math.ceil(totalCount / PAGE_SIZE)}
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
