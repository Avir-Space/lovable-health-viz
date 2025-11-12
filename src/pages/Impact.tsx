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
  dashboard: string;
  name: string;
  unit?: string;
  chart_variant?: string;
  product_sources?: string[];
  time_variants?: string[];
}

interface ImpactTimeseriesRow {
  kpi_key: string;
  value: number;
  bucket: string;
  ts: string;
}

interface ImpactKpiData extends RegistryCard {
  impact_value: number;
}

// Map UI periods to bucket values in impact_timeseries
const PERIOD_TO_BUCKET: Record<KpiRange, string> = {
  '1D': '1D',
  '1W': '1W',
  '2W': '2W',
  '1M': '30d',
  '6M': '6M',
  '1Y': '1Y',
};

export default function Impact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [selectedPeriod, setSelectedPeriod] = useState<KpiRange>('1M');
  const [myImpactCards, setMyImpactCards] = useState<ImpactKpiData[]>([]);
  const [overallImpactCards, setOverallImpactCards] = useState<ImpactKpiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [myPage, setMyPage] = useState(1);
  const [overallPage, setOverallPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to page 1 when switching period
  useEffect(() => {
    if (activeTab === 'my') {
      setMyPage(1);
    } else {
      setOverallPage(1);
    }
  }, [selectedPeriod]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchImpactData();
    }
  }, [selectedPeriod, user]);

  const fetchImpactData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Step 1: Load registry metadata
      const { data: registry, error: registryError } = await supabase
        .from('v_impact_card_registry' as any)
        .select('kpi_key, dashboard, name, unit, chart_variant, product_sources, time_variants')
        .order('name', { ascending: true });

      if (registryError) {
        console.error('[Impact] Registry error:', registryError);
        setMyImpactCards([]);
        setOverallImpactCards([]);
        setIsLoading(false);
        return;
      }

      const bucket = PERIOD_TO_BUCKET[selectedPeriod];

      // Step 2: Fetch My Impact data
      const { data: myData, error: myError } = await supabase
        .from('impact_timeseries' as any)
        .select('kpi_key, value, bucket, ts')
        .eq('context', 'my')
        .eq('user_id', user.id)
        .eq('series', 'impact')
        .eq('bucket', bucket)
        .order('kpi_key', { ascending: true })
        .order('ts', { ascending: false });

      if (myError) {
        console.error('[Impact] My data error:', myError);
      }

      // Step 3: Fetch Overall Impact data
      const { data: overallData, error: overallError } = await supabase
        .from('impact_timeseries' as any)
        .select('kpi_key, value, bucket, ts')
        .eq('context', 'overall')
        .eq('series', 'impact')
        .eq('bucket', bucket)
        .order('kpi_key', { ascending: true })
        .order('ts', { ascending: false });

      if (overallError) {
        console.error('[Impact] Overall data error:', overallError);
      }

      // Step 4: Build maps - latest value per kpi_key
      const myImpactByKpi = new Map<string, number>();
      if (myData && Array.isArray(myData)) {
        myData.forEach((row: any) => {
          if (row && row.kpi_key && !myImpactByKpi.has(row.kpi_key)) {
            myImpactByKpi.set(row.kpi_key, Number(row.value));
          }
        });
      }

      const overallImpactByKpi = new Map<string, number>();
      if (overallData && Array.isArray(overallData)) {
        overallData.forEach((row: any) => {
          if (row && row.kpi_key && !overallImpactByKpi.has(row.kpi_key)) {
            overallImpactByKpi.set(row.kpi_key, Number(row.value));
          }
        });
      }

      console.log('[Impact] Cards in registry:', registry?.length || 0);
      console.log('[Impact] My impact KPIs with data:', myImpactByKpi.size);
      console.log('[Impact] Overall impact KPIs with data:', overallImpactByKpi.size);

      // Step 5: Join and filter - only show cards with data
      const myCards: ImpactKpiData[] = [];
      if (registry && Array.isArray(registry)) {
        registry.forEach((card: any) => {
          if (card && card.kpi_key && myImpactByKpi.has(card.kpi_key)) {
            myCards.push({
              ...card,
              impact_value: myImpactByKpi.get(card.kpi_key)!,
            });
          }
        });
      }

      const overallCards: ImpactKpiData[] = [];
      if (registry && Array.isArray(registry)) {
        registry.forEach((card: any) => {
          if (card && card.kpi_key && overallImpactByKpi.has(card.kpi_key)) {
            overallCards.push({
              ...card,
              impact_value: overallImpactByKpi.get(card.kpi_key)!,
            });
          }
        });
      }

      setMyImpactCards(myCards);
      setOverallImpactCards(overallCards);
    } catch (error: any) {
      console.error('[Impact] Fetch error:', error);
      setMyImpactCards([]);
      setOverallImpactCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCards = activeTab === 'my' ? myImpactCards : overallImpactCards;
  const currentPage = activeTab === 'my' ? myPage : overallPage;
  const setCurrentPage = activeTab === 'my' ? setMyPage : setOverallPage;
  
  const totalPages = Math.ceil(currentCards.length / PAGE_SIZE);
  const paginatedCards = currentCards.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

        <TabsContent value="my" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-2 h-8 w-8" />
              <span className="text-muted-foreground">Loading impact data...</span>
            </div>
          ) : myImpactCards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No personalized impact data available for your account in this period. Try selecting a wider time range.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedCards.map((kpi) => (
                  <ImpactKpiCard
                    key={kpi.kpi_key}
                    kpi_key={kpi.kpi_key}
                    name={kpi.name}
                    unit={kpi.unit}
                    chart_variant={kpi.chart_variant}
                    impact_value={kpi.impact_value}
                    product_sources={kpi.product_sources}
                    context="my"
                  />
                ))}
              </div>
              
              {myImpactCards.length > PAGE_SIZE && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMyPage(p => Math.max(1, p - 1))}
                    disabled={myPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {myPage} of {Math.ceil(myImpactCards.length / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMyPage(p => Math.min(Math.ceil(myImpactCards.length / PAGE_SIZE), p + 1))}
                    disabled={myPage === Math.ceil(myImpactCards.length / PAGE_SIZE)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="overall" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-2 h-8 w-8" />
              <span className="text-muted-foreground">Loading impact data...</span>
            </div>
          ) : overallImpactCards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No measurable impact available for this period. Connect data sources or extend your activity window.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedCards.map((kpi) => (
                  <ImpactKpiCard
                    key={kpi.kpi_key}
                    kpi_key={kpi.kpi_key}
                    name={kpi.name}
                    unit={kpi.unit}
                    chart_variant={kpi.chart_variant}
                    impact_value={kpi.impact_value}
                    product_sources={kpi.product_sources}
                    context="overall"
                  />
                ))}
              </div>
              
              {overallImpactCards.length > PAGE_SIZE && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOverallPage(p => Math.max(1, p - 1))}
                    disabled={overallPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {overallPage} of {Math.ceil(overallImpactCards.length / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOverallPage(p => Math.min(Math.ceil(overallImpactCards.length / PAGE_SIZE), p + 1))}
                    disabled={overallPage === Math.ceil(overallImpactCards.length / PAGE_SIZE)}
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
