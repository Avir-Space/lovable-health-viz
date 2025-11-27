import { useState } from "react";
import { X, TrendingDown, Plane, AlertTriangle, DollarSign, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSimulationProfiles, InventorySimulationProfile } from "@/data/mockSimulation";
import { toast } from "@/hooks/use-toast";

interface CostForecastSimulatorDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partNumber: string;
}

export function CostForecastSimulatorDrawer({ 
  open, 
  onOpenChange, 
  partNumber 
}: CostForecastSimulatorDrawerProps) {
  const profiles = getSimulationProfiles(partNumber);
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id || "");
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  const baseline = profiles[0]; // First profile is always "do nothing" baseline

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCreateTask = () => {
    const description = `Cost forecast scenario for ${partNumber}: ${selectedProfile.label}. ${selectedProfile.summary}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(description).then(() => {
      toast({
        title: "Scenario summary copied",
        description: "The scenario details have been copied to your clipboard. You can paste this into a new task.",
      });
    }).catch(() => {
      toast({
        title: "Create Task",
        description: description,
      });
    });
    
    onOpenChange(false);
  };

  const getDemandScenarioLabel = (scenario: string) => {
    switch (scenario) {
      case "conservative": return "Conservative";
      case "base": return "Base Case";
      case "stress": return "Stress Test";
      default: return scenario;
    }
  };

  const getStrategyLabel = (strategy: string) => {
    return strategy === "predictive" ? "Predictive" : "Reactive";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Cost Forecast Simulator · {partNumber}</SheetTitle>
          </div>
          <SheetDescription>
            Model how different decisions change AOG risk, flights at risk, and cost exposure.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Baseline Snapshot */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Baseline (Current Position)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">AOG Probability</p>
                  <p className="font-semibold text-destructive">{baseline.baselineAogProbabilityPercent}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Aircraft at Risk</p>
                  <p className="font-semibold">{baseline.baselineAircraftAtRisk}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Flights at Risk (30d)</p>
                  <p className="font-semibold">{baseline.baselineFlightsAtRisk30d}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cost Exposure (90d)</p>
                  <p className="font-semibold">{formatCurrency(baseline.baselineCostExposure90dUsd)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Select Scenario</h3>
            <div className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <Button
                  key={profile.id}
                  variant={selectedProfileId === profile.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProfileId(profile.id)}
                  className="text-xs"
                >
                  {profile.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Decision Details */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scenario Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  Reorder: {selectedProfile.reorderQty} units
                </Badge>
                {selectedProfile.repositionQty > 0 && selectedProfile.repositionFrom && selectedProfile.repositionTo && (
                  <Badge variant="secondary" className="text-xs">
                    Reposition: {selectedProfile.repositionQty} from {selectedProfile.repositionFrom} → {selectedProfile.repositionTo}
                  </Badge>
                )}
                {selectedProfile.repositionQty === 0 && (
                  <Badge variant="outline" className="text-xs">
                    Reposition: None
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  Demand: {getDemandScenarioLabel(selectedProfile.demandScenario)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Strategy: {getStrategyLabel(selectedProfile.replacementStrategy)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Baseline vs Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Metric</TableHead>
                    <TableHead className="text-xs text-center">Baseline</TableHead>
                    <TableHead className="text-xs text-center">Scenario</TableHead>
                    <TableHead className="text-xs text-center">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        AOG Probability
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-destructive font-medium">
                      {selectedProfile.baselineAogProbabilityPercent}%
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {selectedProfile.scenarioAogProbabilityPercent}%
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedProfile.scenarioAogProbabilityPercent < selectedProfile.baselineAogProbabilityPercent ? (
                        <Badge variant="secondary" className="text-xs text-green-600">
                          -{selectedProfile.baselineAogProbabilityPercent - selectedProfile.scenarioAogProbabilityPercent}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <Plane className="h-3 w-3" />
                        Aircraft at Risk
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {selectedProfile.baselineAircraftAtRisk}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {selectedProfile.scenarioAircraftAtRisk}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedProfile.scenarioAircraftAtRisk < selectedProfile.baselineAircraftAtRisk ? (
                        <Badge variant="secondary" className="text-xs text-green-600">
                          -{selectedProfile.baselineAircraftAtRisk - selectedProfile.scenarioAircraftAtRisk}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Flights at Risk (30d)
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {selectedProfile.baselineFlightsAtRisk30d}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {selectedProfile.scenarioFlightsAtRisk30d}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedProfile.scenarioFlightsAtRisk30d < selectedProfile.baselineFlightsAtRisk30d ? (
                        <Badge variant="secondary" className="text-xs text-green-600">
                          -{selectedProfile.baselineFlightsAtRisk30d - selectedProfile.scenarioFlightsAtRisk30d}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Cost Exposure (90d)
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(selectedProfile.baselineCostExposure90dUsd)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(selectedProfile.scenarioCostExposure90dUsd)}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedProfile.scenarioCostExposure90dUsd < selectedProfile.baselineCostExposure90dUsd ? (
                        <Badge variant="secondary" className="text-xs text-green-600">
                          -{formatCurrency(selectedProfile.baselineCostExposure90dUsd - selectedProfile.scenarioCostExposure90dUsd)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50 dark:bg-green-950/20">
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-green-600">Savings (90d)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">—</TableCell>
                    <TableCell className="text-center font-bold text-green-600">
                      {formatCurrency(selectedProfile.savings90dUsd)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Narrative Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <p className="text-sm leading-relaxed">{selectedProfile.summary}</p>
            </CardContent>
          </Card>

          <Separator />

          {/* Create Task Button */}
          <Button onClick={handleCreateTask} className="w-full" size="lg">
            <CheckCircle className="h-4 w-4 mr-2" />
            Create Task from this Scenario
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
