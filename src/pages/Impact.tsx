import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RangeChips } from "@/components/ui/range-chips";
import { ImpactKpiCard } from '@/components/impact/ImpactKpiCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KpiRange } from '@/hooks/useKpiData';

type ImpactContext = 'my' | 'overall';

interface RegistryCard {
  kpi_key: string;
  name: string;
  unit?: string;
  product_sources?: string[];
  action_title?: string;
  action_cta_label?: string;
}

interface ImpactKpiData extends RegistryCard {
  impact_value: number;
  impact_unit?: string;
  impact_summary?: string;
}

// Map periods to stored period values
const PERIOD_TO_DB: Record<KpiRange, string> = {
  '1D': '1d',
  '1W': '7d',
  '2W': '14d',
  '1M': '30d',
  '6M': '6m',
  '1Y': '1y',
};

export default function Impact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [selectedPeriod, setSelectedPeriod] = useState<KpiRange>('1M');
  const [allKpis, setAllKpis] = useState<ImpactKpiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to page 1 when switching tabs or period
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedPeriod]);

  useEffect(() => {
    fetchKpis();
  }, [activeTab, selectedPeriod, user]);

  const fetchKpis = async () => {
    setIsLoading(true);
    try {
      // Step 1: Load registry
      const { data: registry, error: registryError } = await supabase
        .from('v_impact_card_registry' as any)
        .select('kpi_key, name, unit, product_sources, action_title, action_cta_label')
        .order('name', { ascending: true });

      if (registryError) {
        console.error('[Impact] Error loading card registry:', registryError);
        setAllKpis([]);
        setIsLoading(false);
        return;
      }

      const period = PERIOD_TO_DB[selectedPeriod];

      // Step 2: Load impact summaries based on active tab
      if (activeTab === 'overall') {
        const { data: overallSummaries, error: overallError } = await supabase
          .from('impact_summaries_overall' as any)
          .select('kpi_key, period, impact_value, impact_unit, impact_summary')
          .eq('period', period);

        if (overallError) {
          console.error('[Impact] Error loading overall summaries:', overallError);
          setAllKpis([]);
          setIsLoading(false);
          return;
        }

        // Join registry with summaries
        const overallByKey = new Map(
          (overallSummaries || []).map((row: any) => [row.kpi_key, row])
        );

        const cards = (registry || [])
          .map((card: any) => {
            const summary = overallByKey.get(card.kpi_key);
            if (!summary) return null;
            return {
              ...card,
              impact_value: Number(summary.impact_value) || 0,
              impact_unit: summary.impact_unit,
              impact_summary: summary.impact_summary,
            };
          })
          .filter(Boolean) as ImpactKpiData[];

        setAllKpis(cards);
      } else {
        // My Impact tab
        if (!user) {
          console.warn('[Impact] No authenticated user for My Impact');
          setAllKpis([]);
          setIsLoading(false);
          return;
        }

        const { data: mySummaries, error: myError } = await supabase
          .from('impact_summaries_user' as any)
          .select('kpi_key, period, impact_value, impact_unit, impact_summary')
          .eq('user_id', user.id)
          .eq('period', period);

        if (myError) {
          console.error('[Impact] Error loading user summaries:', myError);
          setAllKpis([]);
          setIsLoading(false);
          return;
        }

        // Join registry with summaries
        const myByKey = new Map(
          (mySummaries || []).map((row: any) => [row.kpi_key, row])
        );

        const cards = (registry || [])
          .map((card: any) => {
            const summary = myByKey.get(card.kpi_key);
            if (!summary) return null;
            return {
              ...card,
              impact_value: Number(summary.impact_value) || 0,
              impact_unit: summary.impact_unit,
              impact_summary: summary.impact_summary,
            };
          })
          .filter(Boolean) as ImpactKpiData[];

        setAllKpis(cards);
      }
    } catch (error: any) {
      console.error('[Impact] Error fetching KPIs:', error);
      setAllKpis([]);
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
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my">My Impact</TabsTrigger>
            <TabsTrigger value="overall">Overall Impact</TabsTrigger>
          </TabsList>
          <RangeChips selected={selectedPeriod} onChange={setSelectedPeriod} />
        </div>

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
          ) : activeTab === 'my' && allKpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No personalized impact data available for your account yet.
            </div>
          ) : activeTab === 'overall' && allKpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No measurable impact available for this period. Connect data sources or extend your activity window.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allKpis.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((kpi) => (
                  <ImpactKpiCard
                    key={kpi.kpi_key}
                    kpi_key={kpi.kpi_key}
                    name={kpi.name}
                    unit={kpi.unit}
                    impact_value={kpi.impact_value}
                    impact_unit={kpi.impact_unit}
                    impact_summary={kpi.impact_summary}
                    product_sources={kpi.product_sources}
                    action_title={kpi.action_title}
                    action_cta_label={kpi.action_cta_label}
                    context={activeTab}
                  />
                ))}
              </div>
              
              {allKpis.length > PAGE_SIZE && (
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
                    Page {currentPage} of {Math.ceil(allKpis.length / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(allKpis.length / PAGE_SIZE), p + 1))}
                    disabled={currentPage === Math.ceil(allKpis.length / PAGE_SIZE)}
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
