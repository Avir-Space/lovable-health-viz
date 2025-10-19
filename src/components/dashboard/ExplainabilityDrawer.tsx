import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ExplainabilityDrawerProps {
  kpiName: string;
}

export function ExplainabilityDrawer({ kpiName }: ExplainabilityDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{kpiName}</SheetTitle>
          <SheetDescription>
            Detailed explanation and insights for this KPI
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Data Sources</h4>
            <p className="text-sm text-muted-foreground">
              This metric is calculated from multiple integrated systems including AMOS, TRAX, and SAP.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Calculation Method</h4>
            <p className="text-sm text-muted-foreground">
              The value is computed using real-time data aggregation and industry-standard formulas.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">AI Insights</h4>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis and recommendations will be available here.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
