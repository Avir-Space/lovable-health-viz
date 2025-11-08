import { useState, useEffect, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RangeChips } from '@/components/ui/range-chips';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { KpiSourcePills } from '@/components/KpiSourcePills';
import { LineChart } from '@/components/dashboard/charts/LineChart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ImpactContext = 'my' | 'overall';
type TimeRange = '1D' | '1W' | '2W' | '1M' | '6M' | '1Y';

interface ImpactKpiCardProps {
  kpi_key: string;
  name: string;
  variant: string;
  dashboard: string;
  unit?: string;
  time_variants?: string[];
  config: any;
  product_sources?: string[];
  impact_value?: number;
  context: ImpactContext;
  userId?: string | null;
}

export function ImpactKpiCard({
  kpi_key,
  name,
  variant,
  dashboard,
  unit,
  time_variants = ['1D', '1W', '2W', '1M', '6M', '1Y'],
  config,
  product_sources = [],
  impact_value,
  context,
  userId,
}: ImpactKpiCardProps) {
  const [range, setRange] = useState<TimeRange>('1M');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [slideoverData, setSlideoverData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { toast } = useToast();
  
  const productSources = product_sources || config?.sources || config?.product_sources || [];
  
  // Generate AI summary based on impact value
  const impact_summary = impact_value !== undefined
    ? context === 'my'
      ? `In the selected period, AVIR helped this user improve "${name}" by ${impact_value}${unit ? ' ' + unit : ''} using insights from the connected data stack.`
      : `Across all users/tenants, AVIR influenced "${name}" by ${impact_value}${unit ? ' ' + unit : ''} over the selected period.`
    : null;

  useEffect(() => {
    fetchData();
  }, [kpi_key, context, userId, range]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let tsQuery = supabase
        .from('impact_timeseries' as any)
        .select('ts, value')
        .eq('kpi_key', kpi_key)
        .eq('context', context)
        .eq('bucket', 'month')
        .order('ts', { ascending: true });

      if (context === 'my' && userId) {
        tsQuery = tsQuery.eq('user_id', userId);
      }

      const { data: tsData, error: tsError } = await tsQuery;

      if (tsError) throw tsError;

      setTimeseries(tsData || []);
    } catch (error: any) {
      console.error('[Impact] Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load data',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlideoverData = async () => {
    setIsLoadingDetails(true);
    try {
      const { data, error } = await supabase.rpc('get_impact_slideover_payload' as any, {
        p_kpi_key: kpi_key,
        p_user_id: userId || null,
      } as any);

      if (error) throw error;
      setSlideoverData(data);
    } catch (error: any) {
      console.error('[Impact] Error fetching slideover data:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load details',
        description: error.message,
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCTAClick = () => {
    setIsDrawerOpen(true);
    if (!slideoverData) {
      fetchSlideoverData();
    }
  };

  const chartData = useMemo(() => {
    return timeseries.map((point) => ({
      ts: point.ts,
      bucket: new Date(point.ts).toISOString().split('T')[0],
      series: 'value',
      value: point.value,
    }));
  }, [timeseries]);

  const registry = slideoverData?.registry || {};
  const summaryContext = context === 'my' ? slideoverData?.my_summary : slideoverData?.overall_summary;

  return (
    <>
    <Card className="p-4 hover:shadow-md transition-all hover:scale-[1.01] max-h-[400px]">
      <div className="grid grid-rows-[auto_1fr_auto] h-full gap-1">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-[15px] font-semibold leading-snug tracking-tight break-words line-clamp-2 flex-1">
              {name}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-medium">
                {variant}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchData}
                disabled={isLoading}
                className="h-6 w-6 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {productSources.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {productSources.map((source: string) => (
                <span
                  key={source}
                  className="text-white text-xs font-semibold rounded-full px-2.5 py-0.5 shadow-sm select-none"
                  style={{
                    backgroundColor:
                      source.toLowerCase() === 'amos'
                        ? '#1F49B6'
                        : source.toLowerCase() === 'trax'
                        ? '#E6A323'
                        : source.toLowerCase() === 'sap'
                        ? '#32C365'
                        : source.toLowerCase() === 'ramco'
                        ? '#B273F6'
                        : source.toLowerCase() === 'aims'
                        ? '#D84969'
                        : source.toLowerCase() === 'jeppesen'
                        ? '#1F49B6'
                        : '#294BDB',
                  }}
                >
                  {source}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-muted-foreground gap-2">
            <span className="shrink-0">Period:</span>
            <RangeChips selected={range} onChange={setRange} />
          </div>
        </div>

        {/* Chart */}
        <div className="min-h-0">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              <span className="text-[12px] text-muted-foreground">Loading…</span>
            </div>
          ) : chartData.length > 0 ? (
            <LineChart data={chartData} unit={unit || ''} xLabel="Month" yLabel="Impact" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[12px] text-muted-foreground">
              {impact_value !== undefined ? 'No chart data available' : 'No impact data available for this KPI and period yet'}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-2">
          {impact_value !== undefined ? (
            <div className="text-xs">
              <span className="font-semibold">Impact: </span>
              <span className="text-foreground">{impact_value} {unit || ''}</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {context === 'my' ? 'No tracked impact for this user yet.' : 'No overall impact computed yet.'}
            </div>
          )}
          
          {impact_summary && (
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">AI Impact Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{impact_summary}</p>
            </div>
          )}

          <div className="border-t pt-1.5">
            <Button size="sm" onClick={handleCTAClick} className="w-full h-7 text-xs">
              View Full Details
            </Button>
          </div>

        </div>
      </div>
    </Card>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <>
              <SheetHeader className="space-y-3 pb-4">
                <SheetTitle className="text-xl">{name}</SheetTitle>
                <div className="flex flex-wrap gap-2">
                  {productSources.map((source: string) => (
                    <span
                      key={source}
                      className="text-white text-xs font-semibold rounded-full px-2.5 py-1 shadow-sm"
                      style={{
                        backgroundColor:
                          source.toLowerCase() === 'amos'
                            ? '#1F49B6'
                            : source.toLowerCase() === 'trax'
                            ? '#E6A323'
                            : source.toLowerCase() === 'sap'
                            ? '#32C365'
                            : source.toLowerCase() === 'ramco'
                            ? '#B273F6'
                            : source.toLowerCase() === 'aims'
                            ? '#D84969'
                            : source.toLowerCase() === 'jeppesen'
                            ? '#1F49B6'
                            : '#294BDB',
                      }}
                    >
                      {source}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div><span className="font-medium">Dashboard:</span> {dashboard}</div>
                  <div><span className="font-medium">Type:</span> {variant}</div>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h3 className="text-sm font-semibold">AI Impact Summary</h3>
                  <p className="text-sm leading-relaxed">{impact_summary || 'No summary available'}</p>
                  
                  {impact_value !== undefined ? (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Impact Value:</span>
                      <span className="text-base font-semibold">{impact_value} {unit || ''}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      {context === 'my' ? 'No tracked impact for this user yet.' : 'No overall impact computed yet.'}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Product Source(s)</h3>
                  <div className="flex flex-wrap gap-2">
                    {productSources.length > 0 ? (
                      productSources.map((source: string) => (
                        <span
                          key={source}
                          className="text-white text-xs font-semibold rounded-full px-2.5 py-1 shadow-sm"
                          style={{
                            backgroundColor:
                              source.toLowerCase() === 'amos'
                                ? '#1F49B6'
                                : source.toLowerCase() === 'trax'
                                ? '#E6A323'
                                : source.toLowerCase() === 'sap'
                                ? '#32C365'
                                : source.toLowerCase() === 'ramco'
                                ? '#B273F6'
                                : source.toLowerCase() === 'aims'
                                ? '#D84969'
                                : source.toLowerCase() === 'jeppesen'
                                ? '#1F49B6'
                                : '#294BDB',
                          }}
                        >
                          {source}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No sources configured</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This impact reflects AVIR's contribution to improving operational reliability, 
                    compliance, and cost efficiency for this KPI. The AI continuously monitors data 
                    from connected systems and provides actionable recommendations to drive measurable improvements.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" onClick={() => {
                    console.log('[ImpactKpiCard] Create action for KPI:', kpi_key);
                  }}>
                    Create Action from Impact
                  </Button>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
