import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ImpactKpiCard } from '@/components/impact/ImpactKpiCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type ImpactContext = 'my' | 'overall';

interface OverallImpactData {
  kpi_key: string;
  dashboard: string;
  kpi_name: string;
  unit?: string;
  chart_variant: string;
  product_sources: string[];
  current_value?: number;
  previous_value?: number;
  impact_percentage?: number;
  impact_trend?: string;
  computed_at: string;
}

interface MyImpactData {
  user_id: string;
  kpi_key: string;
  dashboard: string;
  kpi_name: string;
  unit?: string;
  chart_variant: string;
  product_sources: string[];
  impact_value?: number;
  computed_at: string;
}

export default function Impact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [overallKpis, setOverallKpis] = useState<OverallImpactData[]>([]);
  const [myKpis, setMyKpis] = useState<MyImpactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchKpis();
  }, [activeTab, currentPage, user]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * PAGE_SIZE;

      if (activeTab === 'my') {
        if (!user) {
          console.warn('[Impact] No authenticated user for My Impact');
          setMyKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        // Fetch from v_impact_my_cards view
        const { data, error, count } = await supabase
          .from('v_impact_my_cards' as any)
          .select('user_id,kpi_key,dashboard,kpi_name,unit,chart_variant,product_sources,impact_value,computed_at', { count: 'exact' })
          .eq('user_id', user.id)
          .order('impact_value', { ascending: false, nullsFirst: false })
          .range(offset, offset + PAGE_SIZE - 1);

        if (error) {
          console.error('[Impact] Error loading My Impact:', error);
          setMyKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        setMyKpis((data as any) || []);
        setTotalCount(count || 0);
      } else {
        // Fetch from v_impact_overall_cards view
        const { data, error, count } = await supabase
          .from('v_impact_overall_cards' as any)
          .select('kpi_key,dashboard,kpi_name,unit,chart_variant,product_sources,current_value,previous_value,impact_percentage,impact_trend,computed_at', { count: 'exact' })
          .order('impact_percentage', { ascending: false, nullsFirst: false })
          .range(offset, offset + PAGE_SIZE - 1);

        if (error) {
          console.error('[Impact] Error loading Overall Impact:', error);
          setOverallKpis([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        setOverallKpis((data as any) || []);
        setTotalCount(count || 0);
      }
    } catch (error: any) {
      console.error('[Impact] Error fetching KPIs:', error);
      setMyKpis([]);
      setOverallKpis([]);
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
          ) : activeTab === 'my' && !user ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Sign in to see your personalized impact</p>
              <Button onClick={() => navigate('/login')}>Sign In</Button>
            </div>
          ) : activeTab === 'my' && myKpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No personalized impact yet. Once your account generates AVIR-driven changes on KPIs, they'll appear here.
            </div>
          ) : activeTab === 'overall' && overallKpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No measurable impact available for this period. Connect data sources or extend your activity window.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'my' 
                  ? myKpis.map((kpi) => (
                      <ImpactKpiCard
                        key={kpi.kpi_key}
                        kpi_key={kpi.kpi_key}
                        name={kpi.kpi_name}
                        variant={kpi.chart_variant}
                        dashboard={kpi.dashboard}
                        unit={kpi.unit}
                        product_sources={kpi.product_sources}
                        impact_value={kpi.impact_value}
                        context="my"
                      />
                    ))
                  : overallKpis.map((kpi) => (
                      <ImpactKpiCard
                        key={kpi.kpi_key}
                        kpi_key={kpi.kpi_key}
                        name={kpi.kpi_name}
                        variant={kpi.chart_variant}
                        dashboard={kpi.dashboard}
                        unit={kpi.unit}
                        product_sources={kpi.product_sources}
                        current_value={kpi.current_value}
                        previous_value={kpi.previous_value}
                        impact_percentage={kpi.impact_percentage}
                        impact_trend={kpi.impact_trend}
                        context="overall"
                      />
                    ))
                }
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
