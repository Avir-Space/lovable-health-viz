import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Clock, RefreshCw, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKpiData, KpiRange } from "@/hooks/useKpiData";
import { LineChart } from "./dashboard/charts/LineChart";
import { BarChart } from "./dashboard/charts/BarChart";
import { PieChart } from "./dashboard/charts/PieChart";
import { GaugeChart } from "./dashboard/charts/GaugeChart";
import { NumericChart } from "./dashboard/charts/NumericChart";
import { HeatmapChart } from "./dashboard/charts/HeatmapChart";
import { TableChart } from "./dashboard/charts/TableChart";
import { DualAxisLine } from "./dashboard/charts/DualAxisLine";
import { formatDistanceToNow } from "date-fns";

export type KpiSource = { name: string };
export type KpiMeta = {
  kpi_key: string;
  name: string;
  variant: string;
  unit?: string;
  x_axis?: string;
  y_axis?: string;
  config?: any;
};

interface KpiCardBackendDrivenProps {
  kpiMeta: KpiMeta;
  sources?: KpiSource[];
  useLiveData?: boolean;
  defaultRange?: KpiRange;
  aiInsight?: string;
  details?: {
    why: string;
    evidence: any[];
    confidence?: number;
    provenance?: string[];
  };
}

const TIME_SERIES_VARIANTS = ['line', 'gauge', 'numeric', 'delta', 'sparkline', 'timeline'];

export function KpiCardBackendDriven({
  kpiMeta,
  sources = [],
  useLiveData = true,
  defaultRange = '1M',
  aiInsight,
  details
}: KpiCardBackendDrivenProps) {
  const [selectedRange, setSelectedRange] = useState<KpiRange>(defaultRange);
  
  // Determine if this KPI shows time-range chips
  const isTimeSeries = TIME_SERIES_VARIANTS.includes(kpiMeta.variant) || !!kpiMeta.config?.dualAxis;
  
  const { payload, isValidating, error, refresh } = useKpiData(
    kpiMeta.kpi_key,
    selectedRange,
    useLiveData
  );

  const handleSync = async () => {
    await refresh();
  };

  const handleRangeChange = (range: KpiRange) => {
    setSelectedRange(range);
  };

  const renderChart = () => {
    if (!payload) {
      return <div className="h-[220px] flex items-center justify-center text-muted-foreground">Loading...</div>;
    }

    if (error) {
      return (
        <div className="h-[220px] flex flex-col items-center justify-center gap-2">
          <div className="text-sm text-destructive">Failed to load data</div>
          <Button size="sm" variant="outline" onClick={() => refresh()}>
            Retry
          </Button>
        </div>
      );
    }

    // Dual-axis special case
    if (kpiMeta.config?.dualAxis) {
      return (
        <DualAxisLine
          data={payload.data || []}
          seriesMap={kpiMeta.config.dualAxis.seriesMap}
          rightAxisName={kpiMeta.config.dualAxis.rightAxisName}
          unitLeft={kpiMeta.unit}
          unitRight={kpiMeta.config.dualAxis.rightAxisUnit}
          xLabel={kpiMeta.x_axis}
          yLabel={kpiMeta.y_axis}
        />
      );
    }

    switch (kpiMeta.variant) {
      case 'line':
      case 'sparkline':
      case 'timeline':
        return (
          <LineChart
            data={payload.data || []}
            unit={kpiMeta.unit}
            xLabel={kpiMeta.x_axis}
            yLabel={kpiMeta.y_axis}
          />
        );

      case 'gauge':
        const gaugeValue = payload.data?.[payload.data.length - 1]?.value || 0;
        return <GaugeChart value={gaugeValue} unit={kpiMeta.unit} />;

      case 'numeric':
        const numericValue = payload.data?.[payload.data.length - 1]?.value || 0;
        return <NumericChart value={numericValue} unit={kpiMeta.unit} label={kpiMeta.y_axis} />;

      case 'delta':
        return (
          <BarChart
            data={payload.data || []}
            unit={kpiMeta.unit}
            xLabel={kpiMeta.x_axis}
            yLabel={kpiMeta.y_axis}
          />
        );

      case 'bar':
      case 'column':
        return (
          <BarChart
            data={payload.data || []}
            unit={kpiMeta.unit}
            xLabel={kpiMeta.x_axis}
            yLabel={kpiMeta.y_axis}
          />
        );

      case 'pie':
        return <PieChart data={payload.data || []} unit={kpiMeta.unit} />;

      case 'heatmap':
        return (
          <HeatmapChart
            data={payload.data || []}
            xLabel={kpiMeta.x_axis}
            yLabel={kpiMeta.y_axis}
          />
        );

      case 'table':
        return <TableChart rows={payload.rows || []} />;

      default:
        return <div className="h-[220px] flex items-center justify-center text-muted-foreground">Unsupported chart type</div>;
    }
  };

  const syncedTime = payload?.generated_at 
    ? `Synced ${formatDistanceToNow(new Date(payload.generated_at), { addSuffix: true })}`
    : 'Not synced';

  return (
    <Card className="rounded-2xl shadow-sm border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{syncedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={handleSync}
                  disabled={isValidating}
                >
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sync Now</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-1.5">
            {sources.map(source => (
              <Badge key={source.name} variant="outline" className="text-[11px] px-2 py-0.5 rounded-full">
                {source.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Time Range Selector - Only for time-series KPIs */}
        {isTimeSeries && (
          <div className="flex items-center gap-2 flex-wrap">
            {(['1D', '1W', '2W', '1M', '6M', '1Y'] as KpiRange[]).map(range => (
              <Button
                key={range}
                size="sm"
                variant={selectedRange === range ? 'default' : 'outline'}
                className="h-7 px-3 text-xs"
                onClick={() => handleRangeChange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        )}

        {/* Chart */}
        {renderChart()}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 space-y-3">
        <div>
          <div className="text-base font-semibold">{kpiMeta.name}</div>
        </div>

        {/* AI Insight */}
        {aiInsight && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="text-xs font-medium text-muted-foreground">AI Insight</div>
            <div className="text-sm">{aiInsight}</div>
            {details && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[500px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Explainability</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Why this suggestion?</h4>
                      <p className="text-sm text-muted-foreground">{details.why}</p>
                    </div>
                    {details.confidence && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Confidence</h4>
                        <Progress value={details.confidence * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {(details.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
