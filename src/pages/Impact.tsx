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
  unit?: string;
  time_variants?: string[];
  config: any;
  product_sources: string[];
  impact_value?: number | string;
  summary_text?: string;
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

      if (activeTab === 'my') {
        // Check auth first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn('[Impact] No authenticated user for My Impact');
          setKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }
        setUserId(user.id);

        // Fetch registry from impact_kpi_registry
        const { data: registry, error: registryError, count } = await supabase
          .from('impact_kpi_registry' as any)
          .select('kpi_key, dashboard, name, chart_variant, unit, product_sources, time_variants, config', { count: 'exact' })
          .order('name', { ascending: true })
          .range(offset, offset + PAGE_SIZE - 1);

        if (registryError) {
          console.error('[Impact] Error loading registry:', registryError);
          setKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        setTotalCount(count || 0);

        // Fetch user impact summaries for all KPIs (not paginated)
        const { data: userSummaries, error: summariesError } = await supabase
          .from('impact_summaries_user' as any)
          .select('kpi_key, impact_value, summary_text')
          .eq('user_id', user.id);

        if (summariesError) {
          console.error('[Impact] Error loading user summaries:', summariesError);
        }

        // Create map for quick lookup
        const summariesMap = new Map(
          (userSummaries as any[] || []).map((s: any) => [s.kpi_key, s])
        );

        // Merge registry with summaries
        const formattedData = (registry || []).map((item: any) => {
          const summary = summariesMap.get(item.kpi_key);
          return {
            kpi_key: item.kpi_key,
            name: item.name,
            variant: item.chart_variant || 'line',
            dashboard: item.dashboard,
            unit: item.unit,
            time_variants: item.time_variants || ['1D', '1W', '2W', '1M', '6M', '1Y'],
            config: item.config || {},
            product_sources: item.product_sources || [],
            impact_value: summary?.impact_value,
            summary_text: summary?.summary_text,
          };
        });

        setKpis(formattedData);
      } else {
        // Overall Impact - use impact_kpi_registry as base
        const { data: registry, error: registryError, count } = await supabase
          .from('impact_kpi_registry' as any)
          .select('kpi_key, dashboard, name, chart_variant, unit, product_sources, time_variants, config', { count: 'exact' })
          .order('name', { ascending: true })
          .range(offset, offset + PAGE_SIZE - 1);

        if (registryError) {
          console.error('[Impact] Error loading registry:', registryError);
          setKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        setTotalCount(count || 0);

        // Fetch overall impact summaries for all KPIs (not paginated)
        const { data: overallSummaries, error: summariesError } = await supabase
          .from('impact_summaries_overall' as any)
          .select('kpi_key, impact_value, summary_text');

        if (summariesError) {
          console.error('[Impact] Error loading overall summaries:', summariesError);
        }

        // Create map for quick lookup
        const summariesMap = new Map(
          (overallSummaries as any[] || []).map((s: any) => [s.kpi_key, s])
        );

        // Merge registry with summaries
        const formattedData = (registry || []).map((item: any) => {
          const summary = summariesMap.get(item.kpi_key);
          return {
            kpi_key: item.kpi_key,
            name: item.name,
            variant: item.chart_variant || 'line',
            dashboard: item.dashboard,
            unit: item.unit,
            time_variants: item.time_variants || ['1D', '1W', '2W', '1M', '6M', '1Y'],
            config: item.config || {},
            product_sources: item.product_sources || [],
            impact_value: summary?.impact_value,
            summary_text: summary?.summary_text,
          };
        });

        setKpis(formattedData);
      }
    } catch (error: any) {
      console.error('[Impact] Error fetching KPIs:', error);
      setKpis([]);
      setTotalCount(0);
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
          ) : activeTab === 'my' && !userId ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to see your personalized impact</p>
              <Button onClick={() => window.location.href = '/login'}>Sign In</Button>
            </div>
          ) : kpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {activeTab === 'my' 
                ? 'No personalized impact yet. Once AVIR runs recommendations on your data, your impact will appear here.'
                : 'No impact data available'}
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
                    unit={kpi.unit}
                    time_variants={kpi.time_variants}
                    config={kpi.config}
                    product_sources={kpi.product_sources}
                    impact_value={typeof kpi.impact_value === 'string' ? parseFloat(kpi.impact_value) : kpi.impact_value}
                    summary_text={kpi.summary_text}
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
