import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, RefreshCw, Pencil, Info, Wand2, MoreVertical, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type KpiSource = { name: string; icon?: string; datasetName?: string; lastSyncNote?: string };
export type EvidenceRow = { label: string; value: string };
export type KpiAction = { label: string; id: string; variant?: "primary" | "secondary" | "ghost"; disabled?: boolean; onTrigger?: (k: string) => void };
export type KpiExplain = { why: string; evidence: EvidenceRow[]; ifIgnored?: string; ifExecuted?: string; confidence?: number; provenance?: string[] };
export type KpiRange = "1D" | "1W" | "2W" | "1M" | "6M" | "1Y";

export type KpiCardProps = {
  kpiKey: string;
  name: string;
  description?: string;
  definition?: string;
  sources: KpiSource[];
  lastSyncedAt: string;
  onSync?: (k: string) => Promise<void>;
  variant: "numeric" | "gauge" | "line" | "bar" | "column" | "pie" | "heatmap" | "table" | "sparkline" | "timeline" | "delta";
  xAxis?: string;
  yAxis?: string;
  data: any[];
  columns?: string[];
  echartsOption?: any;
  getOption?: (base: any) => any;
  aiInsight?: string;
  actions?: KpiAction[];
  details?: KpiExplain;
  defaultRange?: KpiRange;
  ranges?: KpiRange[];
  allowEdit?: boolean;
  allowInfo?: boolean;
  allowGenAi?: boolean;
  allowOptions?: boolean;
  onEdit?: (k: string) => void;
  onGenerateAi?: (k: string) => void;
  onRangeChange?: (r: KpiRange) => void;
};

export function KpiCard(props: KpiCardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [selectedRange, setSelectedRange] = useState<KpiRange>(props.defaultRange || "1M");

  useEffect(() => {
    if (cooldownUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
        setCooldownSeconds(remaining > 0 ? remaining : 0);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldownUntil]);

  const handleSync = async () => {
    if (cooldownUntil > Date.now()) return;
    setIsSyncing(true);
    if (props.onSync) await props.onSync(props.kpiKey);
    setTimeout(() => {
      setIsSyncing(false);
      setCooldownUntil(Date.now() + 60000);
    }, 1000);
  };

  const handleRangeChange = (range: KpiRange) => {
    setSelectedRange(range);
    if (props.onRangeChange) props.onRangeChange(range);
  };

  const exportCSV = () => {
    const cols = props.columns || Object.keys(props.data[0] || {});
    const csvContent = [
      cols.join(","),
      ...props.data.map(row => cols.map(col => row[col]).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${props.kpiKey}.csv`;
    a.click();
  };

  const exportPNG = () => {
    // PNG export for charts only (not table/numeric)
    alert("PNG export coming soon");
  };

  const renderChart = () => {
    // If explicit echartsOption provided, use verbatim
    if (props.echartsOption) {
      const finalOption = props.getOption ? props.getOption(props.echartsOption) : props.echartsOption;
      return <ReactECharts option={finalOption} style={{ height: "220px", width: "100%" }} />;
    }

    // Otherwise build base from variant
    const filteredData = props.data.filter(row => !row.__metadata);
    const xKey = props.columns?.[0] || Object.keys(filteredData[0] || {})[0];
    const yKey = props.columns?.[1] || Object.keys(filteredData[0] || {})[1];

    let baseOption: any = {
      grid: { top: 12, right: 12, bottom: 28, left: 48 },
      tooltip: { trigger: "axis", textStyle: { fontSize: 12 } }
    };

    switch (props.variant) {
      case "line":
        baseOption = {
          ...baseOption,
          xAxis: { type: "category", name: props.xAxis, data: filteredData.map(d => d[xKey]) },
          yAxis: { type: "value", name: props.yAxis },
          series: [{ type: "line", smooth: true, showSymbol: true, data: filteredData.map(d => d[yKey]) }]
        };
        break;

      case "bar":
      case "column":
        baseOption = {
          ...baseOption,
          xAxis: { type: "category", name: props.xAxis, data: filteredData.map(d => d[xKey]), axisLabel: { rotate: filteredData.length > 8 ? 30 : 0 } },
          yAxis: { type: "value", name: props.yAxis },
          series: [{ type: "bar", data: filteredData.map(d => d[yKey]) }]
        };
        break;

      case "gauge":
        const gaugeValue = filteredData[0]?.[yKey] || 0;
        baseOption = {
          series: [{
            type: "gauge",
            detail: { formatter: `{value}${props.yAxis?.includes("%") ? "%" : ""}`, fontSize: 20 },
            data: [{ value: gaugeValue }]
          }]
        };
        break;

      case "pie":
        baseOption = {
          tooltip: { trigger: "item", formatter: "{b}: {d}% ({c})" },
          legend: { bottom: 0 },
          series: [{
            type: "pie",
            radius: ["55%", "75%"],
            avoidLabelOverlap: true,
            label: { formatter: "{b}: {d}% ({c})" },
            data: filteredData.map(d => ({ name: d[xKey], value: d[yKey] }))
          }]
        };
        break;

      case "heatmap":
        const values = filteredData.map(d => d[yKey]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        baseOption = {
          ...baseOption,
          xAxis: { type: "category", name: props.xAxis, data: filteredData.map(d => d[xKey]) },
          yAxis: { type: "category", name: props.yAxis, data: ["Count"] },
          visualMap: { min, max, calculable: false, orient: "vertical", right: 0 },
          series: [{
            type: "heatmap",
            data: filteredData.map((d, i) => [i, 0, d[yKey]]),
            label: { show: true }
          }]
        };
        break;

      case "timeline":
        baseOption = {
          ...baseOption,
          xAxis: { type: "category", name: props.xAxis, data: filteredData.map(d => d[xKey]), axisLabel: { rotate: 30 } },
          yAxis: { type: "value", name: props.yAxis },
          series: [{ type: "bar", data: filteredData.map(d => d[yKey]) }]
        };
        break;

      case "delta":
        baseOption = {
          ...baseOption,
          xAxis: { type: "category", name: props.xAxis, data: filteredData.map(d => d[xKey]) },
          yAxis: { type: "value", name: props.yAxis },
          series: [{
            type: "bar",
            data: filteredData.map(d => ({
              value: d[yKey],
              itemStyle: { color: d[yKey] >= 0 ? "#0EAD69" : "#D32F2F" }
            }))
          }]
        };
        break;

      case "numeric":
        const numValue = filteredData[0]?.[yKey] || 0;
        return (
          <div className="flex items-center justify-center h-[220px]">
            <div className="text-5xl font-bold tabular-nums">{numValue.toFixed(2)}</div>
          </div>
        );

      case "sparkline":
        baseOption = {
          grid: { top: 0, right: 0, bottom: 0, left: 0 },
          xAxis: { type: "category", show: false, data: filteredData.map(d => d[xKey]) },
          yAxis: { type: "value", show: false },
          series: [{ type: "line", smooth: true, showSymbol: false, data: filteredData.map(d => d[yKey]) }]
        };
        break;

      case "table":
        const cols = props.columns || Object.keys(filteredData[0] || {});
        return (
          <div className="max-h-[220px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  {cols.map(col => <TableHead key={col}>{col}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, i) => (
                  <TableRow key={i}>
                    {cols.map(col => (
                      <TableCell key={col} className={typeof row[col] === "number" ? "text-right tabular-nums" : ""} title={String(row[col])}>
                        {typeof row[col] === "number" ? row[col].toFixed(2) : row[col]}
                      </TableCell>
                    ))}</TableRow>
                ))}</TableBody>
            </Table>
          </div>
        );

      default:
        return <div className="text-muted-foreground text-center py-8">Chart type not implemented</div>;
    }

    const finalOption = props.getOption ? props.getOption(baseOption) : baseOption;
    return <ReactECharts option={finalOption} style={{ height: "220px", width: "100%" }} />;
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-neutral-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{props.lastSyncedAt}</span>
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
                  disabled={isSyncing || cooldownUntil > Date.now()}
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {cooldownSeconds > 0 ? `Try again in ${cooldownSeconds}s` : "Sync Now"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-1.5">
            {props.sources.map(source => (
              <TooltipProvider key={source.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[11px] px-2 py-0.5 rounded-full">
                      {source.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <div className="font-semibold">{source.name}</div>
                      {source.datasetName && <div>{source.datasetName}</div>}
                      {source.lastSyncNote && <div className="text-muted-foreground">{source.lastSyncNote}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-3">
          {/* Left tool strip */}
          <div className="flex flex-col space-y-2">
            {props.allowEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => props.onEdit?.(props.kpiKey)}>
                      <Pencil className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Component</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {props.allowInfo && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Info className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-semibold">{props.name}</h4>
                    {props.description && <p className="text-sm text-muted-foreground">{props.description}</p>}
                    {props.definition && <p className="text-xs text-muted-foreground">{props.definition}</p>}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
            {props.allowGenAi && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => props.onGenerateAi?.(props.kpiKey)}>
                      <Wand2 className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generate AI Insights</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {props.allowOptions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <MoreVertical className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={exportPNG} disabled={props.variant === "table" || props.variant === "numeric"}>
                    Export PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem>Open Full Screen</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Chart area */}
          <div className="flex-1">
            {/* Time range chips */}
            {props.ranges && props.ranges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {props.ranges.map(range => (
                  <Button
                    key={range}
                    variant={selectedRange === range ? "default" : "outline"}
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => handleRangeChange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            )}
            {renderChart()}
          </div>
        </div>

        {/* Meta strip */}
        <div className="mt-2 space-y-1">
          <h3 className="font-semibold text-sm" title={props.name}>{props.name}</h3>
          {props.description && (
            <p className="text-xs text-neutral-500 truncate" title={props.description}>
              {props.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      {(props.aiInsight || props.actions?.length) && (
        <div className="flex items-center gap-3 px-4 py-3 border-t bg-muted/30">
          <div className="flex-1 text-sm text-muted-foreground">{props.aiInsight}</div>
          <div className="flex items-center gap-2">
            {props.actions?.map(action => (
              <Button
                key={action.id}
                variant={action.variant === "primary" ? "default" : action.variant || "default"}
                size="sm"
                className="h-7 text-xs"
                disabled={action.disabled}
                onClick={() => action.onTrigger?.(props.kpiKey)}
              >
                {action.label}
              </Button>
            ))}
            {props.details && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Explainability: {props.name}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Why this action?</h4>
                      <p className="text-sm text-muted-foreground">{props.details.why}</p>
                    </div>
                    {props.details.evidence?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Evidence</h4>
                        <ul className="space-y-1">
                          {props.details.evidence.map((ev, i) => (
                            <li key={i} className="text-sm flex justify-between">
                              <span className="text-muted-foreground">{ev.label}:</span>
                              <span className="font-medium">{ev.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {props.details.ifIgnored && (
                      <div>
                        <h4 className="font-semibold mb-2">If Ignored</h4>
                        <p className="text-sm text-muted-foreground">{props.details.ifIgnored}</p>
                      </div>
                    )}
                    {props.details.ifExecuted && (
                      <div>
                        <h4 className="font-semibold mb-2">If Executed</h4>
                        <p className="text-sm text-muted-foreground">{props.details.ifExecuted}</p>
                      </div>
                    )}
                    {typeof props.details.confidence === "number" && (
                      <div>
                        <h4 className="font-semibold mb-2">Confidence</h4>
                        <div className="space-y-2">
                          <Progress value={props.details.confidence * 100} />
                          <p className="text-sm text-muted-foreground">{(props.details.confidence * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    )}
                    {props.details.provenance?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Provenance</h4>
                        <ul className="space-y-1">
                          {props.details.provenance.map((p, i) => (
                            <li key={i} className="text-xs text-muted-foreground font-mono">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
