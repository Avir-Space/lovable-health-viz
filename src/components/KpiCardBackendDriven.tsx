import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, RefreshCw, Sparkles, X, Pin, PinOff, MoreVertical, Bell } from 'lucide-react';
import { KpiRange, KpiVariant, useKpiData } from '@/hooks/useKpiData';
import { useKpiAction } from '@/hooks/useKpiAction';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { RangeChips } from './ui/range-chips';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import GaugeChart from './charts/GaugeChart';
import Heatmap from './charts/HeatmapChart';
import NumericChart from './charts/NumericChart';
import TableGrid from './TableGrid';
import { KpiSourcePills } from './KpiSourcePills';
import { usePinnedKpis } from '@/hooks/usePinnedKpis';
import { useKpiAlerts } from '@/hooks/useKpiAlerts';
import { SetAlertModal } from './alerts/SetAlertModal';

const TIME_SERIES: KpiVariant[] = ['line', 'numeric', 'gauge'];

export default function KpiCardBackendDriven({
  kpi_key,
  name,
  variant,
  unit,
  defaultRange = '1M',
  useLiveData = true,
  dashboard,
  onKpiAction,
  showPin = true,
}: {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  unit?: string | null;
  defaultRange?: KpiRange;
  useLiveData?: boolean;
  dashboard?: string;
  onKpiAction?: (kpi_key: string) => void;
  showPin?: boolean;
}) {
  const [range, setRange] = useState<KpiRange>(defaultRange);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const { toast } = useToast();
  const { isPinned, pin, unpin } = usePinnedKpis();
  const pinned = showPin ? isPinned(kpi_key) : false;
  const { payload, isLoading, isValidating, error, refresh } = useKpiData(
    kpi_key,
    variant,
    range,
    useLiveData
  );
  const { action } = useKpiAction(kpi_key);
  const { rules, createAlert, updateAlert } = useKpiAlerts(kpi_key, dashboard || '');
  const showRanges = TIME_SERIES.includes(variant);
  const existingAlert = rules.length > 0 ? rules[0] : undefined;

  const handleActionClick = () => {
    setIsDrawerOpen(true);
    console.info('[AVIR] AI Action clicked for KPI:', kpi_key);
  };

  const handleDrawerAction = () => {
    if (onKpiAction) {
      onKpiAction(kpi_key);
    }
    console.info('[AVIR] AI Action executed for KPI:', kpi_key);
    setIsDrawerOpen(false);
  };

  const handleSync = async () => {
    try {
      await refresh();
      toast({ 
        title: "Synced", 
        description: "KPI refreshed successfully." 
      });
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Sync failed", 
        description: e?.message ?? "Please check RPC/logs." 
      });
    }
  };

  const handlePinToggle = async () => {
    if (!dashboard) return;
    
    if (pinned) {
      await unpin(kpi_key, dashboard);
    } else {
      await pin(kpi_key, dashboard);
    }
  };

  const body = useMemo(() => {
    if (!payload)
      return (
        <div className="text-[12px] text-muted-foreground">No data.</div>
      );
    const p = payload;

    switch (variant) {
      case 'line':
        return (
          <LineChart
            data={p.timeseries || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={p.categories || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={p.categories || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'gauge': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        const maxVal = p.meta.unit === '%' ? 100 : Math.ceil((Number(v) || 0) * 1.2);
        return (
          <GaugeChart
            value={Number(v) || 0}
            unit={p.meta.unit || '%'}
            max={maxVal}
          />
        );
      }
      case 'heatmap':
        return <Heatmap data={p.heatmap || []} />;
      case 'table':
        return <TableGrid rows={p.tableRows || []} />;
      case 'numeric': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        return (
          <NumericChart
            value={Number(v) || 0}
            unit={p.meta.unit || ''}
            align="left"
          />
        );
      }
      default:
        return <div className="text-xs">Unsupported variant</div>;
    }
  }, [payload, variant, dashboard]);

  return (
    <Card className="p-4 hover:shadow-md transition-all hover:scale-[1.01] h-[420px]">
      <div className="grid grid-rows-[auto_1fr_auto] h-full gap-1">
        {/* Row 1: Header */}
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h4 className="text-[15px] font-semibold leading-snug tracking-tight break-words">
                  {name}
                </h4>
              </TooltipTrigger>
              <TooltipContent className="max-w-[420px]">
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <KpiSourcePills kpiKey={kpi_key} />
          
          <div className="flex items-center gap-2 flex-wrap">
            {showRanges && (
              <RangeChips selected={range} onChange={setRange} />
            )}
            <div className="flex items-center gap-1 ml-auto">
              {showPin && dashboard && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handlePinToggle}
                        className="h-7 w-7 p-0"
                        aria-label={pinned ? 'Unpin KPI' : 'Pin KPI'}
                      >
                        {pinned ? (
                          <PinOff className="h-3.5 w-3.5" />
                        ) : (
                          <Pin className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {pinned ? 'Unpin this KPI' : 'Pin this KPI'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSync}
                disabled={isValidating}
                className="h-7 px-2 text-[11px] gap-1.5"
                aria-label="Sync now"
                title="Sync now"
              >
                {isValidating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Sync
              </Button>

              {/* Actions Menu */}
              {(TIME_SERIES.includes(variant) || variant === 'numeric') && dashboard && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      aria-label="KPI Actions"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsAlertModalOpen(true)}>
                      <Bell className="mr-2 h-4 w-4" />
                      Alerts & Triggers
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Chart Area */}
        <div className="min-h-0">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              <span className="text-[12px] text-muted-foreground">Loading…</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="text-[12px]">
              <AlertDescription>
                Failed to load. Will retry in 5s.
              </AlertDescription>
            </Alert>
          ) : (
            body
          )}
        </div>

        {/* Row 3: Footer */}
        <div className="space-y-2">
          {action && (
            <>
              <div 
                className="border-t pt-1.5 flex flex-wrap justify-between items-start gap-3"
                aria-label="AI Action"
              >
                <div className="flex items-start gap-2 max-w-[70%] flex-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line break-words leading-relaxed font-medium">
                    {action.action_title}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleActionClick}
                  className="shrink-0"
                  aria-label="AI Action CTA"
                >
                  {action.action_cta_label}
                </Button>
              </div>

              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="w-full sm:max-w-[520px] overflow-y-auto">
                  <SheetHeader className="pb-3">
                    <SheetTitle className="text-lg font-semibold pr-6">{name}</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Action
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.action_title}
                      </p>
                    </div>

                    {action.why_this_action && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Why this action
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {action.why_this_action}
                        </p>
                      </div>
                    )}

                    {action.evidence_section && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Evidence
                        </h4>
                        <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                          {action.evidence_section.split(/[•\n]/).filter(Boolean).map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {action.impact_if_ignored && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          If ignored
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {action.impact_if_ignored}
                        </p>
                      </div>
                    )}

                    {action.expected_gain && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Expected gain
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {action.expected_gain}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Product Sources
                      </h4>
                      <KpiSourcePills kpiKey={kpi_key} />
                    </div>
                  </div>

                  <SheetFooter className="mt-4 pt-3 border-t">
                    <Button 
                      onClick={handleDrawerAction}
                      className="w-full"
                      size="lg"
                    >
                      {action.action_cta_label}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </>
          )}

          <div className="text-[11px] text-muted-foreground flex justify-between items-center">
            <span>
              {payload?.generated_at
                ? `Synced ${formatDistanceToNow(new Date(payload.generated_at), { addSuffix: true })}`
                : 'Not synced'}
            </span>
            {payload?.meta?.unit && (
              <span className="text-right">Unit: {payload.meta.unit}</span>
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <SetAlertModal
        open={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        kpiName={name}
        kpiKey={kpi_key}
        dashboardId={dashboard || ''}
        unit={unit || undefined}
        existingRule={existingAlert}
        onSave={createAlert}
        onUpdate={updateAlert}
      />
    </Card>
  );
}
