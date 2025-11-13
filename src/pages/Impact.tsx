import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RangeChips } from "@/components/ui/range-chips";
import { ImpactKpiCard } from '@/components/impact/ImpactKpiCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KpiRange } from '@/hooks/useKpiData';
import { useImpactData } from '@/hooks/useImpactData';
import { useImpactOverall } from '@/hooks/useImpactOverall';

type ImpactContext = 'my' | 'overall';

export default function Impact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ImpactContext>('my');
  const [selectedPeriod, setSelectedPeriod] = useState<KpiRange>('1M');
  const [myPage, setMyPage] = useState(1);
  const [overallPage, setOverallPage] = useState(1);
  const PAGE_SIZE = 10;

  // Map KpiRange to bucket for the new hook
  const bucketMap: Record<KpiRange, string> = {
    '1D': '1D',
    '1W': '1W',
    '2W': '2W',
    '1M': '30d',
    '6M': '6M',
    '1Y': '1Y',
  };

  // Use the new focused Impact Overall hook (only 3 KPIs, no breaking changes)
  const { kpis: overallKpis, isLoading: overallLoading } = useImpactOverall(
    bucketMap[selectedPeriod]
  );

  // Keep My Impact using the existing hook for now
  const { myImpactCards, isLoading: myLoading } = useImpactData(
    selectedPeriod,
    user?.id
  );

  const isLoading = activeTab === 'my' ? myLoading : overallLoading;

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

  const currentCards = activeTab === 'my' ? myImpactCards : overallKpis;
  const currentPage = activeTab === 'my' ? myPage : overallPage;
  const paginatedCards = currentCards.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Map names for the 3 Impact KPIs
  const kpiNames: Record<string, string> = {
    'impact:aog_minutes_avoided': 'AOG Minutes Avoided',
    'impact:fuel_saved_kg': 'Fuel Saved (kg)',
    'impact:cost_saved_usd': 'Cost Saved (USD)',
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
                    impact_unit={kpi.impact_unit}
                    summary={kpi.summary}
                    confidence_pct={kpi.confidence_pct}
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
          ) : overallKpis.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No measurable impact available for this period. Connect data sources or extend your activity window.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedCards.map((kpi) => {
                  // Calculate latest value from timeseries
                  const latestValue = kpi.timeseries.length > 0 
                    ? kpi.timeseries[kpi.timeseries.length - 1].value 
                    : 0;

                  return (
                    <ImpactKpiCard
                      key={kpi.kpi_key}
                      kpi_key={kpi.kpi_key}
                      name={kpiNames[kpi.kpi_key] || kpi.kpi_key}
                      impact_value={latestValue}
                      context="overall"
                    />
                  );
                })}
              </div>
              
              {overallKpis.length > PAGE_SIZE && (
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
                    Page {overallPage} of {Math.ceil(overallKpis.length / PAGE_SIZE)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOverallPage(p => Math.min(Math.ceil(overallKpis.length / PAGE_SIZE), p + 1))}
                    disabled={overallPage === Math.ceil(overallKpis.length / PAGE_SIZE)}
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
