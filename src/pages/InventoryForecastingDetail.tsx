import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Plane, Lightbulb, Share2, ListTodo, DollarSign, AlertCircle } from "lucide-react";
import { getInventoryPart } from "@/data/mockInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function InventoryForecastingDetail() {
  const { partNumber } = useParams<{ partNumber: string }>();
  const navigate = useNavigate();
  const part = getInventoryPart(decodeURIComponent(partNumber || ""));

  if (!part) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate("/inventory-forecasting")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inventory
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Part not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskBadge = (risk: typeof part.risk) => {
    switch (risk) {
      case "high":
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />High Risk</Badge>;
      case "medium":
        return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600"><Clock className="h-3 w-3" />Medium Risk</Badge>;
      case "low":
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />Low Risk</Badge>;
    }
  };

  const stockPercentage = Math.min((part.currentStock / part.minRequired) * 100, 100);
  const networkAvailability = Math.round(
    (part.bases.reduce((sum, b) => sum + b.stock + b.inbound - b.outbound, 0) / part.minRequired) * 100
  );

  // Calculate cumulative demand to find shortage day
  let cumulativeDemand = 0;
  const shortageDay = part.dailyDemand30d.findIndex((demand) => {
    cumulativeDemand += demand;
    return cumulativeDemand > part.currentStock;
  });

  const maxDailyDemand = Math.max(...part.dailyDemand30d, 1);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate("/inventory-forecasting")} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inventory
          </Button>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{part.partNumber}</h1>
              <p className="text-muted-foreground">{part.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" /> Share Forecast
          </Button>
          <Button variant="outline" size="sm">
            <ListTodo className="h-4 w-4 mr-2" /> Open in Central Tasks
          </Button>
          <Button size="sm">
            Create Task
          </Button>
        </div>
      </div>

      {/* Summary Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">{part.category}</Badge>
              {getRiskBadge(part.risk)}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <p className="text-xs text-muted-foreground">Lead Time</p>
              <p className="font-semibold">{part.leadTimeDays} days</p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <p className="text-xs text-muted-foreground">Current Stock</p>
              <p className={`font-semibold ${part.currentStock < part.minRequired ? 'text-destructive' : ''}`}>
                {part.currentStock} / {part.minRequired} min
              </p>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1 max-w-[200px]">
              <p className="text-xs text-muted-foreground mb-1">Stock Level</p>
              <Progress value={stockPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecasting KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>30-Day Forecast</CardDescription>
            <CardTitle className="text-2xl">{part.forecastDemand30d} units</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>90-Day Forecast</CardDescription>
            <CardTitle className="text-2xl">{part.forecastDemand90d} units</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Days Until Shortage</CardDescription>
            <CardTitle className={`text-2xl ${part.daysUntilShortage < 30 ? 'text-destructive' : part.daysUntilShortage < 60 ? 'text-amber-600' : ''}`}>
              {part.daysUntilShortage > 90 ? '90+' : part.daysUntilShortage} days
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AOG Probability</CardDescription>
            <CardTitle className={`text-2xl ${part.aogProbabilityPercent > 25 ? 'text-destructive' : part.aogProbabilityPercent > 10 ? 'text-amber-600' : ''}`}>
              {part.aogProbabilityPercent}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Impact Section */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Impact (Next 30–90 Days)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Plane className="h-3 w-3" />
                Aircraft at Risk (30d)
              </CardDescription>
              <CardTitle className={`text-2xl ${part.aircraftAtRisk30d > 0 ? 'text-destructive' : ''}`}>
                {part.aircraftAtRisk30d}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">tails that could be impacted by shortage</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Flights at Risk (30d)
              </CardDescription>
              <CardTitle className={`text-2xl ${part.flightsAtRisk30d > 0 ? 'text-amber-600' : ''}`}>
                {part.flightsAtRisk30d}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">potentially disrupted departures</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Maintenance Events (90d)
              </CardDescription>
              <CardTitle className="text-2xl">
                {part.maintenanceEventsAtRisk90d}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">checks / tasks depending on this part</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Cost Exposure (90d)
              </CardDescription>
              <CardTitle className={`text-2xl ${part.projectedCostExposure90dUsd > 100000 ? 'text-destructive' : part.projectedCostExposure90dUsd > 50000 ? 'text-amber-600' : ''}`}>
                {formatCurrency(part.projectedCostExposure90dUsd)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">estimated spend or disruption cost</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Chart - using dailyDemand30d */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              30-Day Demand Forecast
            </CardTitle>
            <CardDescription>
              Predicted daily demand based on AVIR analysis · Total: {part.dailyDemand30d.reduce((a, b) => a + b, 0)} units
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-[2px] border-b border-l border-border p-2">
              {part.dailyDemand30d.map((value, idx) => {
                const isAfterShortage = shortageDay !== -1 && idx >= shortageDay;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t transition-colors ${
                      isAfterShortage 
                        ? 'bg-destructive/70 hover:bg-destructive' 
                        : 'bg-primary/60 hover:bg-primary'
                    }`}
                    style={{ 
                      height: value > 0 ? `${Math.max((value / maxDailyDemand) * 100, 15)}%` : '4px',
                      minHeight: '4px'
                    }}
                    title={`Day ${idx + 1}: ${value} unit${value !== 1 ? 's' : ''}${isAfterShortage ? ' (after shortage)' : ''}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
            {shortageDay !== -1 && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Stock depleted on Day {shortageDay + 1} based on current forecast
              </p>
            )}
          </CardContent>
        </Card>

        {/* Network Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Network Inventory
            </CardTitle>
            <CardDescription>
              Stock distribution across bases · Network availability: {networkAvailability}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Base</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Inbound</TableHead>
                  <TableHead className="text-center">Outbound</TableHead>
                  <TableHead className="text-center">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {part.bases.map((base) => (
                  <TableRow key={base.base}>
                    <TableCell className="font-medium">{base.base}</TableCell>
                    <TableCell className="text-center">{base.stock}</TableCell>
                    <TableCell className="text-center text-green-600">+{base.inbound}</TableCell>
                    <TableCell className="text-center text-destructive">-{base.outbound}</TableCell>
                    <TableCell className="text-center font-medium">
                      {base.stock + base.inbound - base.outbound}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Usage Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Usage Drivers
          </CardTitle>
          <CardDescription>Predicted consumption by aircraft based on AVIR analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aircraft</TableHead>
                <TableHead>Fleet Type</TableHead>
                <TableHead className="text-center">Failure Probability</TableHead>
                <TableHead className="text-center">Predicted Replacements</TableHead>
                <TableHead className="text-center">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {part.usageDrivers.map((driver, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-medium">{driver.tail}</TableCell>
                  <TableCell>{driver.fleetType}</TableCell>
                  <TableCell className="text-center">
                    <span className={driver.predictedFailures > 0.5 ? 'text-amber-600' : ''}>
                      {(driver.predictedFailures * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{driver.predictedReplacements}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {driver.predictedFailures > 0.5 ? 'High' : driver.predictedFailures > 0.2 ? 'Medium' : 'Low'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommended Actions
          </CardTitle>
          <CardDescription>AI-generated playbooks to reduce AOG risk and unnecessary spend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {part.recommendedActions.map((action, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}