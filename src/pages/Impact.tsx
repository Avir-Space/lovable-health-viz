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

interface KpiMetaData {
  kpi_key: string;
  name: string;
  unit?: string;
  variant: string;
  dashboard: string;
}

interface ImpactTimeseriesData {
  kpi_key: string;
  value: number;
  ts: string;
  user_id?: string;
}

interface ImpactKpiData {
  kpi_key: string;
  name: string;
  unit?: string;
  variant: string;
  dashboard: string;
  impact_value: number;
}

// Map periods to bucket values
const PERIOD_TO_BUCKET: Record<KpiRange, string> = {
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
      // For My Impact, check authentication first
      if (activeTab === 'my') {
        if (!user) {
          console.warn('[Impact] No authenticated user for My Impact');
          setAllKpis([]);
          setIsLoading(false);
          return;
        }
      }

      // Step 1: Fetch KPI metadata
      const { data: kpiMeta, error: metaError } = await supabase
        .from('kpi_meta')
        .select('kpi_key, name, unit, variant, dashboard');

      if (metaError) {
        console.error('[Impact] Error loading KPI metadata:', metaError);
        setAllKpis([]);
        setIsLoading(false);
        return;
      }

      // Step 2: Fetch impact timeseries data
      const bucket = PERIOD_TO_BUCKET[selectedPeriod];
      let timeseriesQuery = supabase
        .from('impact_timeseries' as any)
        .select('kpi_key, value')
        .eq('context', activeTab)
        .eq('bucket', bucket)
        .eq('series', 'impact');

      // Filter by user_id for My Impact
      if (activeTab === 'my' && user) {
        timeseriesQuery = timeseriesQuery.eq('user_id', user.id);
      }

      const { data: timeseriesData, error: timeseriesError } = await timeseriesQuery;

      if (timeseriesError) {
        console.error('[Impact] Error loading impact timeseries:', timeseriesError);
        setAllKpis([]);
        setIsLoading(false);
        return;
      }

      // Step 3: Join data and create KPI cards
      const kpiMap = new Map<string, ImpactKpiData>();
      
      ((timeseriesData as any) || []).forEach((ts: any) => {
        const meta = (kpiMeta || []).find((m: any) => m.kpi_key === ts.kpi_key);
        if (meta && !kpiMap.has(ts.kpi_key)) {
          kpiMap.set(ts.kpi_key, {
            kpi_key: ts.kpi_key,
            name: meta.name,
            unit: meta.unit,
            variant: meta.variant,
            dashboard: meta.dashboard,
            impact_value: Number(ts.value) || 0,
          });
        }
      });

      // Convert to array and sort by impact value (descending)
      const kpiList = Array.from(kpiMap.values()).sort((a, b) => b.impact_value - a.impact_value);
      
      setAllKpis(kpiList);
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
                    variant={kpi.variant}
                    dashboard={kpi.dashboard}
                    unit={kpi.unit}
                    impact_value={kpi.impact_value}
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
