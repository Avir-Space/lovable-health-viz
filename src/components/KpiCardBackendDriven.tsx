import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, RefreshCw, Loader2 } from "lucide-react";
import { useKpiData, type KpiMeta, type KpiRange } from "@/hooks/useKpiData";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { GaugeChart } from "@/components/charts/GaugeChart";
import { NumericChart } from "@/components/charts/NumericChart";
import { HeatmapChart } from "@/components/charts/HeatmapChart";
import { TableChart } from "@/components/charts/TableChart";

const TIME_SERIES_VARIANTS = new Set(['line', 'sparkline', 'delta']);
const KPI_RANGES: KpiRange[] = ['1D','1W','2W','1M','6M','1Y'];

interface KpiCardBackendDrivenProps {
  kpiMeta: KpiMeta;
  sources?: Array<{ name: string }>;
  useLiveData?: boolean;
  defaultRange?: KpiRange;
  titleOverride?: string;
}

export function KpiCardBackendDriven({
  kpiMeta,
  sources = [],
  useLiveData = true,
  defaultRange = '1M',
  titleOverride,
}: KpiCardBackendDrivenProps) {
  const [selectedRange, setSelectedRange] = useState<KpiRange>(defaultRange);
  
  const showRanges = TIME_SERIES_VARIANTS.has(kpiMeta.variant) || !!kpiMeta.config?.dualAxis;
  
  const { payload, isLoading, isValidating, error, refresh } = useKpiData(
    kpiMeta.kpi_key,
    selectedRange,
    useLiveData
  );

  const title = titleOverride ?? (kpiMeta?.name || kpiMeta.kpi_key);
  const unit = kpiMeta?.unit || '';

  const renderChart = () => {
    if (error) {
      return (
        <div className="h-[240px] flex flex-col items-center justify-center gap-2">
          <div className="text-sm text-destructive">Failed to load data</div>
          <Button size="sm" variant="outline" onClick={() => refresh()}>
            Retry
          </Button>
        </div>
      );
    }

    if (isLoading || !payload) {
      return <div className="h-[240px] flex items-center justify-center text-muted-foreground">Loading...</div>;
    }

    const xLabel = kpiMeta.x_axis ?? '';
    const yLabel = kpiMeta.y_axis ?? '';

    switch (kpiMeta.variant) {
      case 'line':
      case 'sparkline':
      case 'delta':
        return <LineChart data={payload.timeseries ?? []} unit={unit} xLabel={xLabel} yLabel={yLabel} />;

      case 'gauge': {
        const val = payload?.latest?.value ?? payload?.timeseries?.at(-1)?.value ?? 0;
        return <GaugeChart value={val} unit={unit || '%'} />;
      }

      case 'numeric': {
        const val = payload?.latest?.value ?? payload?.timeseries?.at(-1)?.value ?? 0;
        return <NumericChart value={val} unit={unit} />;
      }

      case 'bar':
      case 'column':
        return <BarChart data={payload.categories ?? []} unit={unit} xLabel={xLabel} yLabel={yLabel} />;

      case 'pie':
        return <PieChart data={payload.categories ?? []} unit={unit} />;

      case 'heatmap':
        return <HeatmapChart data={payload.heatmap ?? []} xLabel={xLabel} yLabel={yLabel} />;

      case 'table':
        return <TableChart rows={payload.tableRows ?? []} />;

      default:
        return <div className="h-[240px] flex items-center justify-center text-muted-foreground">Unsupported variant</div>;
    }
  };

  const syncedTime = payload?.generated_at 
    ? `Synced ${new Date(payload.generated_at).toLocaleString()}`
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
                  onClick={() => refresh()}
                  disabled={isValidating}
                >
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sync Now</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {sources.length > 0 && (
            <div className="flex items-center gap-1.5">
              {sources.map(source => (
                <Badge key={source.name} variant="outline" className="text-[11px] px-2 py-0.5 rounded-full">
                  {source.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Time Range Selector - Only for time-series KPIs */}
        {showRanges && (
          <div className="flex items-center gap-2 flex-wrap">
            {KPI_RANGES.map(range => (
              <Button
                key={range}
                size="sm"
                variant={selectedRange === range ? 'default' : 'outline'}
                className="h-7 px-3 text-xs"
                onClick={() => setSelectedRange(range)}
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
      <div className="px-4 pb-4">
        <div className="text-base font-semibold">{title}</div>
      </div>
    </Card>
  );
}
