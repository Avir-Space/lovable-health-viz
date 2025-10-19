import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "./SourceBadge";
import { RefreshButton } from "./RefreshButton";
import { ExplainabilityDrawer } from "./ExplainabilityDrawer";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface KPICardProps {
  title: string;
  sources?: string[];
  children: ReactNode;
  onRefresh?: () => void;
  aiSuggestion?: string;
}

export function KPICard({ title, sources = ["AMOS"], children, onRefresh, aiSuggestion }: KPICardProps) {
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
                View Details
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
