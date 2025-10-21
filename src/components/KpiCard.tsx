import { useState, useRef, useCallback, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Clock, RefreshCw, Pencil, Info, Wand2, MoreVertical, Download, Maximize2, ChevronDown, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Types
export type KpiSource = {
  name: "AMOS" | "TRAX" | "SAP" | "Ramco" | "AIMS" | "Jeppesen" | string;
  icon?: string;
  datasetName?: string;
  lastSyncNote?: string;
};

export type EvidenceRow = { label: string; value: string };

export type KpiAction = {
  label: string;
  id: string;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  onTrigger?: (kpiKey: string) => void;
};

export type KpiExplainability = {
  why: string;
  evidence: EvidenceRow[];
  ifIgnored?: string;
  ifExecuted?: string;
  confidence?: number;
  provenance?: string[];
};

export type KpiTimeRange = "1D" | "1W" | "2W" | "1M" | "6M" | "1Y";

export type KpiCardProps = {
  kpiKey: string;
  name: string;
  description?: string;
  definition?: string;

  sources: KpiSource[];
  lastSyncedAt: string;
  onSync?: (kpiKey: string) => Promise<void>;

  variant: "numeric" | "gauge" | "line" | "bar" | "column" | "pie" | "heatmap" | "table" | "sparkline" | "timeline" | "delta" | "line+numeric";
  xAxis?: string;
  yAxis?: string;
  data: any[];
  columns?: string[];

  aiInsight?: string;
  actions?: KpiAction[];

  details?: KpiExplainability;

  defaultRange?: KpiTimeRange;
  ranges?: KpiTimeRange[];

  allowEdit?: boolean;
  allowInfo?: boolean;
  allowGenAi?: boolean;
  allowOptions?: boolean;

  onEdit?: (kpiKey: string) => void;
  onGenerateAi?: (kpiKey: string) => void;
  onRangeChange?: (range: KpiTimeRange) => void;
};

export function KpiCard({
  kpiKey,
  name,
  description,
  definition,
  sources,
  lastSyncedAt,
  onSync,
  variant,
  xAxis = "X",
  yAxis = "Y",
  data,
  columns = [],
  aiInsight,
  actions = [],
  details,
  defaultRange = "1M",
  ranges = ["1D", "1W", "2W", "1M", "6M", "1Y"],
  allowEdit = true,
  allowInfo = true,
  allowGenAi = true,
  allowOptions = true,
  onEdit,
  onGenerateAi,
  onRangeChange,
}: KpiCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<KpiTimeRange>(defaultRange);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const chartRef = useRef<ReactECharts>(null);

  const cooldownRemaining = useMemo(() => {
    if (!cooldownUntil) return 0;
    const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
    return remaining;
  }, [cooldownUntil]);

  const handleSync = useCallback(async () => {
    if (isSyncing || cooldownRemaining > 0) return;

    setIsSyncing(true);
    try {
      await onSync?.(kpiKey);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSyncing(false);
      setCooldownUntil(Date.now() + 60000);
      setTimeout(() => setCooldownUntil(null), 60000);
    }
  }, [isSyncing, cooldownRemaining, onSync, kpiKey]);

  const handleRangeChange = useCallback((range: KpiTimeRange) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  }, [onRangeChange]);

  const exportCSV = useCallback(() => {
    const headers = columns.length > 0 ? columns : Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => row[h]).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kpiKey}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, columns, kpiKey]);

  const exportPNG = useCallback(() => {
    if (variant === "table" || variant === "numeric") return;
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      const url = chart.getDataURL({ type: "png", pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${kpiKey}.png`;
      a.click();
    }
  }, [variant, kpiKey]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      !["KPI Variant", "Variant Detail", "Reason to Track"].includes(String(Object.values(item)[0]))
    );
  }, [data]);

  const sortedData = useMemo(() => {
    if (!sortColumn || variant !== "table") return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const direction = sortDirection === "asc" ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [filteredData, sortColumn, sortDirection, variant]);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }, [sortColumn]);

  const renderChart = () => {
    if (variant === "numeric") {
      const value = filteredData[0]?.[columns[1]] ?? filteredData[0]?.[Object.keys(filteredData[0] || {})[1]] ?? 0;
      return (
        <div className="flex flex-col items-center justify-center h-[220px]">
          <div className="text-5xl font-bold text-primary">{typeof value === "number" ? value.toFixed(1) : value}</div>
        </div>
      );
    }

    if (variant === "table") {
      const tableColumns = columns.length > 0 ? columns : Object.keys(filteredData[0] || {});
      return (
        <div className="h-[220px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map(col => (
                  <TableHead
                    key={col}
                    onClick={() => handleSort(col)}
                    className="cursor-pointer hover:bg-muted"
                    title={`Sort by ${col}`}
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, idx) => (
                <TableRow key={idx}>
                  {tableColumns.map(col => {
                    const value = row[col];
                    const displayValue = typeof value === "number" ? value.toFixed(2) : value;
                    return (
                      <TableCell key={col} title={String(value)}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    const option = getChartOption();
    return (
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "220px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    );
  };

  const getChartOption = () => {
    const xKey = columns[0];
    const yKey = columns[1];

    const commonGrid = {
      top: 40,
      right: variant === "line+numeric" ? 60 : 12,
      bottom: 40,
      left: 60,
      containLabel: true,
    };

    const commonTooltip = {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      formatter: (params: any) => {
        if (Array.isArray(params)) {
          const items = params.map((p: any) => {
            const value = typeof p.value === "number" ? p.value.toFixed(2) : p.value;
            return `${p.seriesName}: ${value}`;
          }).join("<br/>");
          return `${params[0].name}<br/>${items}`;
        }
        return "";
      },
    };

    switch (variant) {
      case "gauge": {
        const value = filteredData[0]?.[yKey] ?? 0;
        return {
          series: [{
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                width: 8,
                color: [[1, "hsl(var(--chart-3))"]],
              },
            },
            pointer: { itemStyle: { color: "hsl(var(--primary))" } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            detail: {
              formatter: `{value}%`,
              fontSize: 24,
              color: "hsl(var(--primary))",
              offsetCenter: [0, "0%"],
            },
            data: [{ value, name: yAxis }],
          }],
        };
      }

      case "pie": {
        return {
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
          },
          legend: { orient: "vertical", right: 10, top: "center" },
          series: [{
            type: "pie",
            radius: ["40%", "70%"],
            data: filteredData.map(item => ({
              name: item[xKey],
              value: item[yKey],
            })),
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0, 0, 0, 0.5)" } },
          }],
        };
      }

      case "line":
      case "line+numeric": {
        const series: any[] = [{
          name: yKey,
          type: "line",
          smooth: true,
          data: filteredData.map(item => item[yKey]),
          symbol: "circle",
          symbolSize: 6,
        }];

        if (variant === "line+numeric" && columns.length > 3) {
          series.push({
            name: columns[3],
            type: "line",
            smooth: true,
            yAxisIndex: 1,
            data: filteredData.map(item => item[columns[3]]),
            symbol: "circle",
            symbolSize: 6,
          });
        }

        return {
          tooltip: commonTooltip,
          grid: commonGrid,
          xAxis: {
            type: "category",
            data: filteredData.map(item => item[xKey]),
            name: xAxis,
            nameLocation: "middle",
            nameGap: 30,
          },
          yAxis: variant === "line+numeric" ? [
            { type: "value", name: yAxis, nameLocation: "middle", nameGap: 50 },
            { type: "value", name: columns[3], nameLocation: "middle", nameGap: 50 },
          ] : {
            type: "value",
            name: yAxis,
            nameLocation: "middle",
            nameGap: 50,
          },
          series,
        };
      }

      case "bar":
      case "column":
      case "timeline": {
        return {
          tooltip: commonTooltip,
          grid: commonGrid,
          xAxis: {
            type: "category",
            data: filteredData.map(item => item[xKey]),
            name: xAxis,
            nameLocation: "middle",
            nameGap: 30,
            axisLabel: { rotate: filteredData.length > 8 ? 30 : 0 },
          },
          yAxis: {
            type: "value",
            name: yAxis,
            nameLocation: "middle",
            nameGap: 50,
          },
          series: [{
            type: "bar",
            data: filteredData.map(item => item[yKey]),
            itemStyle: { borderRadius: [8, 8, 0, 0] },
          }],
        };
      }

      case "heatmap": {
        const values = filteredData.map(item => item[yKey]);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        
        return {
          tooltip: {
            trigger: "item",
            formatter: (params: any) => `${params.name}: ${params.value.toFixed(2)}`,
          },
          grid: commonGrid,
          xAxis: {
            type: "category",
            data: filteredData.map(item => item[xKey]),
            name: xAxis,
            nameLocation: "middle",
            nameGap: 30,
          },
          yAxis: { type: "value", show: false },
          visualMap: {
            min: minValue,
            max: maxValue,
            calculable: true,
            orient: "horizontal",
            left: "center",
            bottom: 0,
            inRange: {
              color: ["hsl(var(--chart-5))", "hsl(var(--chart-3))", "hsl(var(--chart-1))"],
            },
          },
          series: [{
            type: "bar",
            data: values,
            itemStyle: { borderRadius: [8, 8, 0, 0] },
          }],
        };
      }

      default:
        return {};
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-border bg-card flex flex-col animate-fade-in hover:scale-[1.01] transition-transform duration-200">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b h-[40px]">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{lastSyncedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full"
                  onClick={handleSync}
                  disabled={isSyncing || cooldownRemaining > 0}
                  aria-label={cooldownRemaining > 0 ? `Try again in ${cooldownRemaining}s` : "Sync Now"}
                >
                  {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {cooldownRemaining > 0 ? `Try again in ${cooldownRemaining}s` : "Sync Now"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-1">
            {sources.map((source, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {source.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-semibold">{source.name}</div>
                      {source.datasetName && <div>Dataset: {source.datasetName}</div>}
                      {source.lastSyncNote && <div>{source.lastSyncNote}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Time Range Chips */}
      {ranges.length > 0 && (
        <div className="px-4 pt-2 flex gap-1">
          {ranges.map(range => (
            <Button
              key={range}
              size="sm"
              variant={selectedRange === range ? "default" : "ghost"}
              className="h-6 px-2 text-xs"
              onClick={() => handleRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 px-4 pt-3 pb-2">
        {/* Left Toolbar */}
        <div className="flex flex-col gap-2 mr-2 w-[44px]">
          {allowEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onEdit?.(kpiKey)}
                    aria-label="Edit Component"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Component</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {allowInfo && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Info">
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">{name}</h4>
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                  {definition && <p className="text-xs text-muted-foreground italic">{definition}</p>}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          {allowGenAi && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onGenerateAi?.(kpiKey)}
                    aria-label="Generate AI Insights"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate AI Insights</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {allowOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Options">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportCSV}>
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportPNG} disabled={variant === "table" || variant === "numeric"}>
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export PNG
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="h-3.5 w-3.5 mr-2" />
                  Open full screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Chart Area */}
        <div className="flex-1">
          {renderChart()}
        </div>
      </div>

      {/* Meta Strip */}
      <div className="px-4 py-2 border-t min-h-[28px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <div className="font-semibold text-sm truncate" title={name}>{name}</div>
                {description && (
                  <div className="text-xs text-muted-foreground truncate" title={description}>
                    {description}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-xs">
                <div className="font-semibold">{name}</div>
                {description && <div className="text-xs">{description}</div>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Footer */}
      {(aiInsight || actions.length > 0 || details) && (
        <div className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between min-h-[56px]">
          <div className="flex-1 flex items-center gap-2">
            {aiInsight && <p className="text-sm text-muted-foreground flex-1">{aiInsight}</p>}
            {actions.map(action => {
              const buttonVariant = action.variant === "primary" ? "default" : (action.variant || "outline");
              return (
                <Button
                  key={action.id}
                  size="sm"
                  variant={buttonVariant as "default" | "destructive" | "ghost" | "link" | "outline" | "secondary"}
                  disabled={action.disabled}
                  onClick={() => action.onTrigger?.(kpiKey)}
                  className="h-7 text-xs"
                >
                  {action.label}
                </Button>
              );
            })}
          </div>

          {details && (
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 ml-2" aria-label="Show Explainability">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Explainability: {name}</SheetTitle>
                  <SheetDescription>Detailed analysis and evidence</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Why this action?</h4>
                    <p className="text-sm text-muted-foreground">{details.why}</p>
                  </div>

                  {details.evidence && details.evidence.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Evidence</h4>
                      <ul className="space-y-2">
                        {details.evidence.map((item, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.ifIgnored && (
                    <div>
                      <h4 className="font-semibold mb-2">If Ignored</h4>
                      <p className="text-sm text-muted-foreground">{details.ifIgnored}</p>
                    </div>
                  )}

                  {details.ifExecuted && (
                    <div>
                      <h4 className="font-semibold mb-2">If Executed</h4>
                      <p className="text-sm text-muted-foreground">{details.ifExecuted}</p>
                    </div>
                  )}

                  {typeof details.confidence === "number" && (
                    <div>
                      <h4 className="font-semibold mb-2">Confidence</h4>
                      <div className="space-y-2">
                        <Progress value={details.confidence * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground">{(details.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  )}

                  {details.provenance && details.provenance.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Provenance</h4>
                      <ul className="space-y-1">
                        {details.provenance.map((item, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground font-mono">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      )}
    </Card>
  );
}
