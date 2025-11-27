import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin, Plane, Lightbulb, Share2, ListTodo, DollarSign, AlertCircle, Eye, BarChart3, Network, Users, Zap } from "lucide-react";
import { getInventoryPart } from "@/data/mockInventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InventoryForecastingDetail() {
  const { partNumber } = useParams<{ partNumber: string }>();
  const navigate = useNavigate();
  const part = getInventoryPart(decodeURIComponent(partNumber || ""));

  const sections = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'impact', label: 'Impact', icon: AlertCircle },
    { id: 'forecast', label: 'Forecast', icon: BarChart3 },
    { id: 'network-inventory', label: 'Network Inventory', icon: Network },
    { id: 'usage-drivers', label: 'Usage Drivers', icon: Plane },
    { id: 'financial-exposure', label: 'Financial Exposure', icon: DollarSign },
    { id: 'playbooks', label: 'Playbooks & Actions', icon: Zap },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
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

  // Calculate financial metrics
  const costExposure30d = Math.round(part.projectedCostExposure90dUsd / 3);
  const potentialSavings = Math.round(part.projectedCostExposure90dUsd * 0.35);
  const downtimeCostPerDay = Math.round(part.projectedCostExposure90dUsd / 90);
  const procurementSpikeRisk = part.daysUntilShortage < part.leadTimeDays ? 'high' : part.daysUntilShortage < part.leadTimeDays * 1.5 ? 'medium' : 'low';

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-20">
        <div className="px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/inventory-forecasting')} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory List
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Inventory Profile · {part.partNumber}</h1>
                <p className="text-muted-foreground">{part.description}</p>
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
        </div>
      </div>

      {/* Summary Bar */}
      <div className="border-b bg-muted/20 sticky top-[97px] z-10">
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Category</p>
              <Badge variant="outline" className="capitalize mt-1">{part.category}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Risk Level</p>
              <div className="mt-1">{getRiskBadge(part.risk)}</div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Lead Time</p>
              <p className="font-medium">{part.leadTimeDays} days</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Current Stock</p>
              <p className={`font-medium ${part.currentStock < part.minRequired ? 'text-destructive' : ''}`}>
                {part.currentStock} / {part.minRequired} min
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Stock Level</p>
              <Progress value={stockPercentage} className="h-2 mt-2" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Days Until Shortage</p>
              <p className={`font-medium ${part.daysUntilShortage < 30 ? 'text-destructive' : part.daysUntilShortage < 60 ? 'text-amber-600' : ''}`}>
                {part.daysUntilShortage > 90 ? '90+' : part.daysUntilShortage} days
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">AOG Probability</p>
              <p className={`font-medium ${part.aogProbabilityPercent > 25 ? 'text-destructive' : part.aogProbabilityPercent > 10 ? 'text-amber-600' : ''}`}>
                {part.aogProbabilityPercent}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Network Availability</p>
              <p className="font-medium">{networkAvailability}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation */}
        <nav className="w-64 border-r bg-muted/10 p-4 overflow-y-auto">
          <div className="space-y-1">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => scrollToSection(section.id)}
              >
                <section.icon className="h-4 w-4 mr-2" />
                {section.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* Right Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 max-w-7xl">

            {/* Overview Section */}
            <section id="overview" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Part Number</CardDescription>
                    <CardTitle className="text-xl font-mono">{part.partNumber}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{part.description}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Category</CardDescription>
                    <CardTitle className="text-xl capitalize">{part.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {part.category === 'rotable' ? 'Repairable, tracked by serial number' : 'Expendable, tracked by quantity'}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Lead Time</CardDescription>
                    <CardTitle className="text-xl">{part.leadTimeDays} days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Standard procurement lead time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Health Indicator</CardDescription>
                    <CardTitle className="text-xl">{getRiskBadge(part.risk)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Based on stock, demand, and lead time</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Current Stock vs Min</CardDescription>
                    <CardTitle className={`text-2xl ${part.currentStock < part.minRequired ? 'text-destructive' : ''}`}>
                      {part.currentStock} / {part.minRequired}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={stockPercentage} className="h-2" />
                  </CardContent>
                </Card>
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
              </div>

              <p className="text-xs text-muted-foreground">Last updated: via AVIR AI · {new Date().toLocaleDateString()}</p>
            </section>

            {/* Impact Section */}
            <section id="impact" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Impact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      Aircraft at Risk (30d)
                    </CardDescription>
                    <CardTitle className={`text-3xl ${part.aircraftAtRisk30d > 0 ? 'text-destructive' : ''}`}>
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
                    <CardTitle className={`text-3xl ${part.flightsAtRisk30d > 0 ? 'text-amber-600' : ''}`}>
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
                    <CardTitle className="text-3xl">
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
                    <CardTitle className={`text-3xl ${part.projectedCostExposure90dUsd > 100000 ? 'text-destructive' : part.projectedCostExposure90dUsd > 50000 ? 'text-amber-600' : ''}`}>
                      {formatCurrency(part.projectedCostExposure90dUsd)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">estimated spend or disruption cost</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">If No Action Is Taken</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on current stock levels and predicted demand, there is a {part.aogProbabilityPercent}% probability of AOG within {part.daysUntilShortage} days. 
                        This could affect {part.aircraftAtRisk30d} aircraft and {part.flightsAtRisk30d} flights, with projected cost exposure of {formatCurrency(part.projectedCostExposure90dUsd)} over 90 days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">Based on predictive maintenance schedules, fleet utilization, and part failure likelihood.</p>
            </section>

            {/* Forecast Section */}
            <section id="forecast" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Forecast
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>30-Day Demand Forecast</CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>90-Day Demand Overview</CardDescription>
                    <CardTitle className="text-2xl">{part.forecastDemand90d} units</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Extended forecast based on scheduled maintenance, flight cycles, and historical patterns.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Trend Commentary</CardDescription>
                    <CardTitle className="text-base">
                      {shortageDay !== -1 
                        ? `Demand expected to peak around Day ${shortageDay + 1}–${shortageDay + 5}`
                        : 'Demand remains stable across forecast period'
                      }
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {part.risk === 'high' 
                        ? 'AVIR recommends proactive procurement to avoid disruption.'
                        : 'Current stock levels should meet projected demand.'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Network Inventory Section */}
            <section id="network-inventory" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Network Inventory
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Base-wise Stock Distribution</CardTitle>
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
                        <TableHead className="text-center">Net Position</TableHead>
                        <TableHead className="text-center">Risk</TableHead>
                        <TableHead>Suggestion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {part.bases.map((base) => {
                        const netPosition = base.stock + base.inbound - base.outbound;
                        const baseRisk = netPosition <= 0 ? 'high' : netPosition <= 1 ? 'medium' : 'low';
                        return (
                          <TableRow key={base.base}>
                            <TableCell className="font-medium">{base.base}</TableCell>
                            <TableCell className="text-center">{base.stock}</TableCell>
                            <TableCell className="text-center text-green-600">+{base.inbound}</TableCell>
                            <TableCell className="text-center text-destructive">-{base.outbound}</TableCell>
                            <TableCell className="text-center font-medium">{netPosition}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getRiskColor(baseRisk)}>{baseRisk.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                              {baseRisk === 'high' && (
                                <Badge variant="outline" className="text-xs">Reposition suggested</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">
                Network availability: {networkAvailability}% (calculated as total available stock ÷ minimum required)
              </p>
            </section>

            {/* Usage Drivers Section */}
            <section id="usage-drivers" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Usage Drivers
              </h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Per-Aircraft Predicted Consumption</CardTitle>
                  <CardDescription>Consumption is driven by predicted shop visits and reliability trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aircraft</TableHead>
                        <TableHead>Fleet Type</TableHead>
                        <TableHead className="text-center">Predicted Failures (%)</TableHead>
                        <TableHead className="text-center">Predicted Replacements</TableHead>
                        <TableHead className="text-center">Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {part.usageDrivers.map((driver, idx) => {
                        const confidence = driver.predictedFailures > 0.5 ? 'High' : driver.predictedFailures > 0.2 ? 'Medium' : 'Low';
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-mono font-medium">{driver.tail}</TableCell>
                            <TableCell>{driver.fleetType}</TableCell>
                            <TableCell className="text-center">
                              <span className={driver.predictedFailures > 0.5 ? 'text-amber-600 font-medium' : ''}>
                                {(driver.predictedFailures * 100).toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">{driver.predictedReplacements}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={confidence === 'High' ? 'destructive' : confidence === 'Medium' ? 'outline' : 'secondary'}>
                                {confidence}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="bg-muted/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">AVIR Insight</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This part's demand is mostly coming from {part.usageDrivers[0]?.fleetType || 'A320 family'} aircraft. 
                        {part.usageDrivers.filter(d => d.predictedFailures > 0.3).length > 0 && 
                          ` ${part.usageDrivers.filter(d => d.predictedFailures > 0.3).length} aircraft show elevated failure probability requiring proactive attention.`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Financial Exposure Section */}
            <section id="financial-exposure" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Exposure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cost Exposure (30d)</CardDescription>
                    <CardTitle className="text-2xl">{formatCurrency(costExposure30d)}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cost Exposure (90d)</CardDescription>
                    <CardTitle className={`text-2xl ${part.projectedCostExposure90dUsd > 100000 ? 'text-destructive' : ''}`}>
                      {formatCurrency(part.projectedCostExposure90dUsd)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Potential Savings</CardDescription>
                    <CardTitle className="text-2xl text-green-600">{formatCurrency(potentialSavings)}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">via proactive optimization</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Procurement Spike Risk</CardDescription>
                    <CardTitle>
                      <Badge variant={getRiskColor(procurementSpikeRisk)} className="text-base px-3 py-1">
                        {procurementSpikeRisk.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Over Time</CardTitle>
                  <CardDescription>Projected cost exposure trajectory based on current inventory position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">30-Day Exposure</span>
                        <span className="font-medium">{formatCurrency(costExposure30d)}</span>
                      </div>
                      <Progress value={33} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">60-Day Exposure</span>
                        <span className="font-medium">{formatCurrency(costExposure30d * 2)}</span>
                      </div>
                      <Progress value={66} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">90-Day Exposure</span>
                        <span className="font-medium">{formatCurrency(part.projectedCostExposure90dUsd)}</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Estimated Downtime Cost</CardDescription>
                    <CardTitle className="text-xl">{formatCurrency(downtimeCostPerDay)} / day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Based on average AOG cost and flight disruption impact
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Proactive vs Reactive Delta</CardDescription>
                    <CardTitle className="text-xl text-green-600">-{formatCurrency(potentialSavings)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Savings from proactive replacement vs reactive AOG response
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Playbooks & Actions Section */}
            <section id="playbooks" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Playbooks & Actions
              </h2>
              
              <p className="text-sm text-muted-foreground">
                AI-generated playbooks to reduce AOG risk and unnecessary spend
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {part.recommendedActions.map((action, idx) => (
                  <Card key={idx} className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{action.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">Playbook</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Why now?</span>
                          <span>{part.daysUntilShortage < part.leadTimeDays ? 'Lead time exceeded' : 'Proactive optimization'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expected savings</span>
                          <span className="text-green-600">{formatCurrency(Math.round(potentialSavings / part.recommendedActions.length))}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-4">
                        Create Task
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Need more options?</p>
                      <p className="text-sm text-muted-foreground">Run a cost forecast simulation or notify base stores directly.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Cost Forecast Simulation</Button>
                      <Button variant="outline" size="sm">Notify Base Stores</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
