import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Plane, Lightbulb, Share2, ListTodo } from "lucide-react";
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
  const daysUntilShortage = part.forecastDemand30d > 0 
    ? Math.round((part.currentStock / part.forecastDemand30d) * 30) 
    : 999;
  const networkAvailability = Math.round(
    (part.bases.reduce((sum, b) => sum + b.stock + b.inbound - b.outbound, 0) / part.minRequired) * 100
  );
  const aogProbability = part.risk === "high" ? 35 : part.risk === "medium" ? 12 : 3;

  // Mock demand curve data points for chart
  const demandCurve = Array.from({ length: 30 }, (_, i) => {
    const base = part.forecastDemand30d / 30;
    const variance = Math.sin(i * 0.3) * (base * 0.3);
    return Math.max(0, base + variance);
  });
  const maxDemand = Math.max(...demandCurve);

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
            <CardTitle className={`text-2xl ${daysUntilShortage < 30 ? 'text-destructive' : daysUntilShortage < 60 ? 'text-amber-600' : ''}`}>
              {daysUntilShortage > 90 ? '90+' : daysUntilShortage} days
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AOG Probability</CardDescription>
            <CardTitle className={`text-2xl ${aogProbability > 25 ? 'text-destructive' : aogProbability > 10 ? 'text-amber-600' : ''}`}>
              {aogProbability}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              30-Day Demand Forecast
            </CardTitle>
            <CardDescription>Predicted daily demand based on fleet activity and maintenance schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1 border-b border-l border-border p-2">
              {demandCurve.map((value, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-primary/60 hover:bg-primary transition-colors rounded-t"
                  style={{ height: `${(value / maxDemand) * 100}%`, minHeight: '4px' }}
                  title={`Day ${idx + 1}: ${value.toFixed(2)} units`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
            </div>
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
          <CardDescription>Predicted consumption by aircraft based on AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aircraft</TableHead>
                <TableHead>Fleet Type</TableHead>
                <TableHead className="text-center">Predicted Failures</TableHead>
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
          <CardDescription>AI-generated recommendations based on forecast analysis</CardDescription>
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
