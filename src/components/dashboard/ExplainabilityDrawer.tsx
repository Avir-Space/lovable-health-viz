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
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Why this action</h4>
            <p className="text-sm text-muted-foreground">
              This recommendation is based on pattern analysis across historical maintenance data and predictive modeling.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Evidence</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Historical trend analysis shows recurring pattern in this metric</li>
              <li>• Similar scenarios in past 90 days resulted in operational delays</li>
              <li>• Current trajectory indicates 85% probability of threshold breach</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">If ignored</h4>
            <p className="text-sm text-muted-foreground">
              Risk of increased AOG events, potential maintenance delays, and estimated $50K-$100K in additional costs over next 30 days.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">If executed</h4>
            <p className="text-sm text-muted-foreground">
              Expected 40% reduction in related incidents, improved fleet availability by 2-3%, and cost avoidance of $75K-$150K over next quarter.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Confidence</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "87%" }}></div>
              </div>
              <span className="text-sm font-medium">87%</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Provenance</h4>
            <p className="text-sm text-muted-foreground">
              Data sources: AMOS (maintenance records), TRAX (flight logs), SAP (parts inventory). Model: AVIR Predictive Analytics Engine v2.1.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
