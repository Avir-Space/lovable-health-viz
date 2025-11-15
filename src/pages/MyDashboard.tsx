import { LayoutDashboard, Loader2, PinOff } from "lucide-react";
import { usePinnedKpis } from "@/hooks/usePinnedKpis";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useImpactOverall } from "@/hooks/useImpactOverall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EChart from "@/components/charts/EChart";
import { fmt } from "@/lib/num";
import KpiCardBackendDriven from "@/components/KpiCardBackendDriven";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useComplianceBenchmarks } from "@/hooks/useComplianceBenchmarks";

const DASHBOARD_LABELS: Record<string, string> = {
  'maintenance-health': 'Maintenance Health',
  'inventory-spares-visibility': 'Inventory & Spares',
  'compliance-airworthiness': 'Compliance & Airworthiness',
  'ops-dispatch-reliability': 'Ops & Dispatch',
  'fuel-efficiency': 'Fuel & Efficiency',
  'financial-procurement': 'Financial & Procurement',
  'crew-duty-snapshot': 'Crew & Duty',
  'overall-impact': 'Overall Impact',
};

interface KpiMeta {
  kpi_key: string;
  name: string;
  variant: string;
  unit?: string;
  dashboard: string;
}

export default function MyDashboard() {
  const { pinnedList, isLoading: pinsLoading, unpin } = usePinnedKpis();
  const { kpis: impactKpis, isLoading: impactLoading } = useImpactOverall('30d');
  const { benchmarks } = useComplianceBenchmarks();
  const [regularKpis, setRegularKpis] = useState<KpiMeta[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  // Load metadata for regular (non-impact) KPIs
  useEffect(() => {
    const loadRegularKpis = async () => {
      const regularPins = pinnedList.filter(p => !p.kpi_key.startsWith('impact:'));
      
      if (regularPins.length === 0) {
        setRegularKpis([]);
        setIsLoadingMeta(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('kpi_meta')
          .select('kpi_key, name, variant, unit, dashboard')
          .in('kpi_key', regularPins.map(p => p.kpi_key));

        if (error) throw error;
        
        // Sort by pinned order
        const sorted = regularPins
          .map(pin => data?.find(d => d.kpi_key === pin.kpi_key))
          .filter(Boolean) as KpiMeta[];
        
        setRegularKpis(sorted);
      } catch (error) {
        console.error('[MyDashboard] Error loading KPI meta:', error);
        setRegularKpis([]);
      } finally {
        setIsLoadingMeta(false);
      }
    };

    loadRegularKpis();
  }, [pinnedList]);

  const handleUnpin = async (kpi_key: string, source_dashboard: string) => {
    await unpin(kpi_key, source_dashboard);
  };

  if (pinsLoading || isLoadingMeta || impactLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading pinned KPIs...</span>
        </div>
      </div>
    );
  }

  const impactPins = pinnedList.filter(p => p.kpi_key.startsWith('impact:'));
  const hasAnyPins = pinnedList.length > 0;

  if (!hasAnyPins) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <LayoutDashboard className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground max-w-md">
            No pinned KPIs yet.<br />
            Pin KPIs from any dashboard to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">
          Your pinned KPIs from across all modules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render regular KPIs */}
        {regularKpis.map((kpiMeta) => {
          const pin = pinnedList.find(p => p.kpi_key === kpiMeta.kpi_key);
          if (!pin) return null;

          // Check if this is a Compliance KPI and get benchmark overrides
          const bm = pin.source_dashboard === 'compliance-airworthiness' 
            ? benchmarks[kpiMeta.kpi_key] 
            : undefined;
          
          const overrideStats = bm
            ? {
                currentValue: bm.current_value,
                previousValue: bm.last_period_value,
                unit: bm.unit,
                targetBand: bm.target_band,
                aiSummaryText: bm.ai_summary_text,
                aiCtaTitle: bm.ai_recommendation_title,
                aiCtaLabel: bm.ai_recommendation_cta_label,
              }
            : undefined;

          return (
            <div key={kpiMeta.kpi_key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs max-w-[60%] truncate">
                  From: {DASHBOARD_LABELS[pin.source_dashboard] || pin.source_dashboard}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUnpin(kpiMeta.kpi_key, pin.source_dashboard)}
                      >
                        <PinOff className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Unpin this KPI
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <KpiCardBackendDriven
                kpi_key={kpiMeta.kpi_key}
                name={kpiMeta.name}
                variant={kpiMeta.variant as any}
                unit={kpiMeta.unit}
                dashboard={kpiMeta.dashboard}
                overrideStats={overrideStats}
              />
            </div>
          );
        })}

        {/* Render Impact KPIs */}
        {impactPins.map((pin) => {
          const impactKpi = impactKpis.find(k => k.kpi_key === pin.kpi_key);
          if (!impactKpi) return null;

          const latestValue = impactKpi.latestValue ?? 0;

          const chartOption = {
            grid: { top: 40, right: 20, bottom: 40, left: 60 },
            xAxis: {
              type: 'category',
              data: impactKpi.timeseries.map((p) => {
                const date = new Date(p.ts);
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              }),
              axisLabel: { rotate: 45, fontSize: 11 },
            },
            yAxis: {
              type: 'value',
              name: impactKpi.unit,
              nameLocation: 'middle',
              nameGap: 45,
              axisLabel: {
                formatter: (value: number) => fmt(value),
              },
            },
            series: [
              {
                data: impactKpi.timeseries.map((p) => p.value),
                type: 'line',
                smooth: true,
                areaStyle: {
                  opacity: 0.2,
                },
                lineStyle: {
                  width: 2,
                },
                itemStyle: {
                  color: 'hsl(var(--primary))',
                },
              },
            ],
            tooltip: {
              trigger: 'axis',
              formatter: (params: any) => {
                const param = params[0];
                return `${param.axisValue}<br/>${fmt(param.value)} ${impactKpi.unit}`;
              },
            },
          };

          return (
            <div key={impactKpi.kpi_key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs max-w-[60%] truncate">
                  From: {DASHBOARD_LABELS[pin.source_dashboard] || pin.source_dashboard}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleUnpin(impactKpi.kpi_key, pin.source_dashboard)}
                      >
                        <PinOff className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Unpin this KPI
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{impactKpi.label}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {fmt(latestValue)}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {impactKpi.unit}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <EChart option={chartOption} height={200} />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
