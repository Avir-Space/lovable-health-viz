import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DeltaChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
}

export function DeltaChart({ data, xKey, yKey }: DeltaChartProps) {
  const getIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-5 w-5" style={{ color: "#D32F2F" }} />;
    if (value < 0) return <TrendingDown className="h-5 w-5" style={{ color: "#0EAD69" }} />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getColor = (value: number) => {
    if (value > 0) return "#D32F2F";
    if (value < 0) return "#0EAD69";
    return "hsl(var(--muted-foreground))";
  };

  return (
    <ScrollArea className="h-64">
      <div className="space-y-3 p-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getIcon(item[yKey])}
              <span className="font-medium">{item[xKey]}</span>
            </div>
            <div className="text-lg font-semibold" style={{ color: getColor(item[yKey]) }}>
              {item[yKey] > 0 ? "+" : ""}
              {item[yKey]}%
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
