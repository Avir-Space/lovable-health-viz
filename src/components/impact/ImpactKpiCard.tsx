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
  unit?: string;
  product_sources?: string[];
  action_title?: string;
  action_cta_label?: string;
  context: ImpactContext;
  userId?: string | null;
}

export function ImpactKpiCard({
  kpi_key,
  name,
  unit,
  product_sources,
  action_title,
  action_cta_label,
  context,
  userId,
}: ImpactKpiCardProps) {
  const [range, setRange] = useState<TimeRange>('1M');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [slideoverData, setSlideoverData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [kpi_key, context, userId, range]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch timeseries
      const { data: tsData, error: tsError } = await supabase
        .from('impact_timeseries' as any)
        .select('ts, value')
        .eq('kpi_key', kpi_key)
        .eq('context', context)
        .eq('bucket', 'month')
        .order('ts', { ascending: true });

      if (tsError) throw tsError;

      // Fetch latest summary
      const summaryQuery = supabase
        .from('impact_ai_summaries' as any)
        .select('summary, impact_value, impact_unit, confidence_pct')
        .eq('kpi_key', kpi_key)
        .eq('context', context)
        .order('period_end', { ascending: false })
        .limit(1);

      if (context === 'my' && userId) {
        summaryQuery.eq('user_id', userId);
      }

      const { data: summaryData, error: summaryError } = await summaryQuery.maybeSingle();

      if (summaryError) throw summaryError;

      setTimeseries(tsData || []);
      setSummary(summaryData);
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
    <Card className="p-4 hover:shadow-md transition-all hover:scale-[1.01] h-[420px]">
      <div className="grid grid-rows-[auto_1fr_auto] h-full gap-1">
        {/* Header */}
        <div className="space-y-2">
          <h4 className="text-[15px] font-semibold leading-snug tracking-tight break-words">
            {name}
          </h4>

          {product_sources && product_sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2.5 mb-1">
              {product_sources.map((source) => (
                <span
                  key={source}
                  className="text-white text-xs font-semibold rounded-full px-3 py-1 shadow-sm select-none"
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

          <div className="flex items-center gap-2 flex-wrap">
            <RangeChips selected={range} onChange={setRange} />
            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              disabled={isLoading}
              className="h-7 px-2 text-[11px] gap-1.5 ml-auto"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Sync
            </Button>
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
              No data available
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-2">
          {summary && (
            <div className="text-sm text-muted-foreground leading-relaxed">
              {summary.summary}
              {summary.impact_value && (
                <span className="font-semibold text-foreground ml-2">
                  {summary.impact_value}
                  {summary.impact_unit}
                </span>
              )}
            </div>
          )}

          {action_title && (
            <div className="border-t pt-1.5 flex flex-wrap justify-between items-start gap-3">
              <div className="flex items-start gap-2 max-w-[70%] flex-1">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line break-words leading-relaxed font-medium">
                  {action_title}
                </p>
              </div>
              <Button size="sm" onClick={handleCTAClick} className="shrink-0">
                {action_cta_label || 'View Impact'}
              </Button>
            </div>
          )}

          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetContent className="w-full sm:max-w-[520px] overflow-y-auto">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              ) : (
                <>
                  <SheetHeader className="pb-3">
                    <SheetTitle className="text-lg font-semibold pr-6">{name}</SheetTitle>
                  </SheetHeader>

                  <div className="mt-3 space-y-3">
                    {registry.action_title && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Action
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {registry.action_title}
                        </p>
                      </div>
                    )}

                    {registry.why_this_action && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Why this action</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {registry.why_this_action}
                        </p>
                      </div>
                    )}

                    {registry.evidence_section && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Evidence</h4>
                        <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                          {registry.evidence_section.split(/[•\n]/).filter(Boolean).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {registry.impact_if_ignored && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">If ignored</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {registry.impact_if_ignored}
                        </p>
                      </div>
                    )}

                    {registry.expected_gain && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Expected gain</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {registry.expected_gain}
                        </p>
                      </div>
                    )}

                    {summaryContext && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Impact Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {summaryContext.summary}
                        </p>
                        {summaryContext.confidence_pct && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Confidence</span>
                              <span>{summaryContext.confidence_pct}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2 transition-all"
                                style={{ width: `${summaryContext.confidence_pct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Product Sources</h4>
                      <KpiSourcePills kpiKey={kpi_key} />
                    </div>
                  </div>

                  <SheetFooter className="mt-4 pt-3 border-t">
                    <Button onClick={() => setIsDrawerOpen(false)} className="w-full" size="lg">
                      {action_cta_label || 'Close'}
                    </Button>
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Card>
  );
}
