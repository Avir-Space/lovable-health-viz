import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "./SourceBadge";
import { RefreshButton } from "./RefreshButton";
import { ExplainabilityDrawer } from "./ExplainabilityDrawer";
import { Button } from "@/components/ui/button";
import { Sparkles, Pin, PinOff } from "lucide-react";
import { usePinnedKpis } from "@/hooks/usePinnedKpis";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KPICardProps {
  title: string;
  sources?: string[];
  children: ReactNode;
  onRefresh?: () => void;
  aiSuggestion?: string;
  aiAction?: string;
  showPin?: boolean;
  kpiKey?: string;
  sourceDashboard?: string;
}

export function KPICard({ 
  title, 
  sources = ["AMOS"], 
  children, 
  onRefresh, 
  aiSuggestion, 
  aiAction,
  showPin = false,
  kpiKey,
  sourceDashboard,
}: KPICardProps) {
  const { isPinned, pin, unpin } = usePinnedKpis();
  const pinned = kpiKey ? isPinned(kpiKey) : false;

  const handlePinToggle = async () => {
    if (!kpiKey || !sourceDashboard) return;
    
    if (pinned) {
      await unpin(kpiKey, sourceDashboard);
    } else {
      await pin(kpiKey, sourceDashboard);
    }
  };

  return (
    <Card className="flex flex-col animate-fade-in hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-semibold" title={title}>{title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {sources.map((source) => (
                <SourceBadge key={source} source={source} />
              ))}
              <span className="text-xs text-muted-foreground">Synced a few seconds ago</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ExplainabilityDrawer kpiName={title} />
            <RefreshButton onRefresh={onRefresh} />
            {showPin && kpiKey && sourceDashboard && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handlePinToggle}
                    >
                      {pinned ? (
                        <PinOff className="h-4 w-4" />
                      ) : (
                        <Pin className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {pinned ? 'Unpin this KPI' : 'Pin this KPI'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">{children}</CardContent>
      {aiSuggestion && (
        <CardFooter className="pt-3 border-t bg-muted/30">
          <div className="flex items-start gap-2 w-full">
            <Sparkles className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground">{aiSuggestion}</p>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                {aiAction || "View Details"}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
