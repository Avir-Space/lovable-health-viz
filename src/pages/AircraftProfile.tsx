import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, TrendingUp, Plane, Wrench, Shield, Package, DollarSign, Users, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAircraftProfile } from '@/data/mockAircraftProfiles';

export default function AircraftProfile() {
  const { aircraftId } = useParams<{ aircraftId: string }>();
  const navigate = useNavigate();
  const aircraft = getAircraftProfile(aircraftId || 'default');

  const sections = [
    { id: 'signals', label: 'Signals', icon: AlertTriangle },
    { id: 'impact', label: 'Impact', icon: TrendingUp },
    { id: 'ops-profile', label: 'Ops Profile & Flight Activity', icon: Plane },
    { id: 'maintenance', label: 'Maintenance Snapshot', icon: Wrench },
    { id: 'airworthiness', label: 'Airworthiness & Compliance', icon: Shield },
    { id: 'inventory', label: 'Inventory & Spares', icon: Package },
    { id: 'financial', label: 'Financial Snapshot', icon: DollarSign },
    { id: 'crew', label: 'Crew Touchpoints', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'playbooks', label: 'Playbooks & Actions', icon: Zap },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
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

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'ready': return 'outline';
      case 'in_maintenance': return 'secondary';
      case 'scheduled': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-20">
        <div className="px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/aircraft')} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Aircraft List
          </Button>
          <h1 className="text-2xl font-bold">Aircraft Profile · {aircraft.registration}</h1>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="border-b bg-muted/20 sticky top-[73px] z-10">
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Fleet Type</p>
              <p className="font-medium">{aircraft.fleetType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Base</p>
              <p className="font-medium">{aircraft.baseAirport}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Readiness</p>
              <Badge variant={getReadinessColor(aircraft.readinessStatus)}>
                {aircraft.readinessStatus.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Airworthiness</p>
              <Badge variant="outline">{aircraft.airworthinessState}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Health Index</p>
              <div className="flex items-center gap-2">
                <Progress value={aircraft.healthIndex} className="h-2 flex-1" />
                <span className="font-medium text-xs">{aircraft.healthIndex}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Next Maintenance</p>
              <p className="font-medium">{aircraft.nextMaintenanceDays}d</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Next Compliance</p>
              <p className="font-medium">{aircraft.nextComplianceDays}d</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Last seen:</span>
              <span className="font-medium">{aircraft.lastSeenMinutes}m ago via {aircraft.lastPosition.source}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="text-muted-foreground">{aircraft.aiStatusSummary}</div>
            {aircraft.isAog && <Badge variant="destructive">AOG</Badge>}
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
            
            {/* Signals */}
            <section id="signals" className="space-y-4">
              <h2 className="text-xl font-semibold">Signals</h2>
              <div className="space-y-3">
                {aircraft.signals.map((signal, idx) => (
                  <Card key={idx} className={`${getSeverityColor(signal.severity)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRiskColor(signal.severity)}>{signal.severity.toUpperCase()}</Badge>
                            <Badge variant="outline" className="text-xs">{signal.source}</Badge>
                          </div>
                          <CardTitle className="text-base">{signal.title}</CardTitle>
                          <CardDescription>{signal.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">Create Task</Button>
                        <Button size="sm" variant="outline">Open Source Dashboard</Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        <strong>Recommended:</strong> {signal.recommendedAction}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Impact */}
            <section id="impact" className="space-y-4">
              <h2 className="text-xl font-semibold">Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Savings (90d)</CardDescription>
                    <CardTitle className="text-2xl">${aircraft.impact.totalSavings90d.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>AOG Minutes Avoided</CardDescription>
                    <CardTitle className="text-2xl">{aircraft.impact.aogMinutesAvoided}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Delay Reduction</CardDescription>
                    <CardTitle className="text-2xl">{aircraft.impact.delayReduction}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Forecast Risk</CardDescription>
                    <Badge variant={getRiskColor(aircraft.impact.forecastImpactRisk)} className="text-base px-3 py-1">
                      {aircraft.impact.forecastImpactRisk.toUpperCase()}
                    </Badge>
                  </CardHeader>
                </Card>
              </div>
              {aircraft.impact.weeklyTrend.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Impact Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-32">
                      {aircraft.impact.weeklyTrend.map((week, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary rounded-t" style={{ height: `${(week.value / 16000) * 100}%` }} />
                          <span className="text-xs text-muted-foreground">{week.week}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Ops Profile */}
            <section id="ops-profile" className="space-y-4">
              <h2 className="text-xl font-semibold">Ops Profile & Flight Activity</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Last Known Position</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Coordinates:</span>
                        <p className="font-mono">{aircraft.lastPosition.lat.toFixed(4)}, {aircraft.lastPosition.lon.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Altitude:</span>
                        <p>{aircraft.lastPosition.altitude.toLocaleString()} ft</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Speed:</span>
                        <p>{aircraft.lastPosition.speed} kt</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Source:</span>
                        <Badge variant="outline">{aircraft.lastPosition.source}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Live map integration coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Utilization & Reliability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Last 7 Days</span>
                        <span className="font-medium">{aircraft.opsProfile.utilization7d}h</span>
                      </div>
                      <Progress value={(aircraft.opsProfile.utilization7d / 50) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Last 30 Days</span>
                        <span className="font-medium">{aircraft.opsProfile.utilization30d}h</span>
                      </div>
                      <Progress value={(aircraft.opsProfile.utilization30d / 200) * 100} className="h-2" />
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dispatch Reliability</span>
                      <span className="font-medium">{aircraft.opsProfile.dispatchReliability}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fuel Efficiency</span>
                      <span className="font-medium">{aircraft.opsProfile.fuelEfficiency}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {aircraft.opsProfile.flights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Flights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.opsProfile.flights.map((flight, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{flight.date}</span>
                            <span className="font-medium">{flight.from} → {flight.to}</span>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">Block: {flight.blockTime}</span>
                            <span className="text-muted-foreground">Flight: {flight.flightTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.opsProfile.recurringDelays.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recurring Delay Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.opsProfile.recurringDelays.map((delay, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <div>
                            <p className="font-medium">{delay.route}</p>
                            <p className="text-sm text-muted-foreground">{delay.cause}</p>
                          </div>
                          <Badge variant="outline">Avg: {delay.avgDelay}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Maintenance Snapshot */}
            <section id="maintenance" className="space-y-4">
              <h2 className="text-xl font-semibold">Maintenance Snapshot</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Next Due Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aircraft.maintenanceSnapshot.nextDue.map((task, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-muted-foreground">Due in {task.dueIn}</p>
                        </div>
                        <Badge variant={getRiskColor(task.risk)}>{task.risk.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {aircraft.maintenanceSnapshot.abnormalPatterns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Abnormal Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aircraft.maintenanceSnapshot.abnormalPatterns.map((pattern, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <p className="font-medium">{pattern.title}</p>
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.maintenanceSnapshot.lifedPartWarnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lifed Part Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.maintenanceSnapshot.lifedPartWarnings.map((part, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <p className="font-medium">{part.part}</p>
                          <span className="text-sm text-muted-foreground">{part.remaining}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Airworthiness */}
            <section id="airworthiness" className="space-y-4">
              <h2 className="text-xl font-semibold">Airworthiness & Compliance</h2>
              
              {aircraft.airworthiness.upcomingCompliance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aircraft.airworthiness.upcomingCompliance.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{item.type}</Badge>
                              <p className="font-medium">{item.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">Due in {item.dueIn}</p>
                          </div>
                          <div className="w-32">
                            <Progress value={75} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.airworthiness.overdue.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Overdue Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.airworthiness.overdue.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <p className="font-medium">{item.title}</p>
                          <Badge variant="destructive">Overdue {item.overdueBy}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.airworthiness.melItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>MEL Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.airworthiness.melItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <p className="font-medium">{item.item}</p>
                          <span className="text-sm text-muted-foreground">Deferred until {item.deferredUntil}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.airworthiness.upcomingCompliance.length === 0 && 
               aircraft.airworthiness.overdue.length === 0 && 
               aircraft.airworthiness.melItems.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">All compliance items up to date</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Inventory */}
            <section id="inventory" className="space-y-4">
              <h2 className="text-xl font-semibold">Inventory & Spares</h2>
              
              {aircraft.inventory.blockingParts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parts Blocking Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aircraft.inventory.blockingParts.map((part, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <div>
                            <p className="font-medium">{part.part}</p>
                            <p className="text-sm text-muted-foreground">Lead time: {part.leadTime}</p>
                          </div>
                          <Badge variant={getRiskColor(part.risk)}>{part.risk.toUpperCase()}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.inventory.reservedParts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Reserved Parts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.inventory.reservedParts.map((part, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <p className="font-medium">{part.part}</p>
                          <Badge variant="outline">{part.location}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.inventory.blockingParts.length === 0 && aircraft.inventory.reservedParts.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No inventory concerns</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Financial */}
            <section id="financial" className="space-y-4">
              <h2 className="text-xl font-semibold">Financial Snapshot</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Maintenance Cost (90d)</CardDescription>
                    <CardTitle className="text-2xl">${aircraft.financial.maintenanceCost90d.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Forecast (30d)</CardDescription>
                    <CardTitle className="text-2xl">${aircraft.financial.forecastCost30d.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cost per Flight Hour</CardDescription>
                    <CardTitle className="text-2xl">
                      ${aircraft.opsProfile.utilization30d > 0 ? Math.round(aircraft.financial.maintenanceCost90d / (aircraft.opsProfile.utilization30d * 3)) : 0}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {aircraft.financial.partCostBreakdown.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Part Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {aircraft.financial.partCostBreakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                          <p className="font-medium">{item.part}</p>
                          <span className="font-medium">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Crew Touchpoints */}
            <section id="crew" className="space-y-4">
              <h2 className="text-xl font-semibold">Crew Touchpoints</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aircraft.crew.recurringIssues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recurring Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {aircraft.crew.recurringIssues.map((issue, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                            <p className="font-medium">{issue.issue}</p>
                            <Badge variant="outline">{issue.count}x</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Fatigue Risk</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-8">
                    <Badge variant={getRiskColor(aircraft.crew.fatigueRisk)} className="text-lg px-4 py-2">
                      {aircraft.crew.fatigueRisk.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {aircraft.crew.observations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Observations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aircraft.crew.observations.map((obs, idx) => (
                        <div key={idx} className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">{obs.date}</p>
                          <p className="font-medium">{obs.note}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {aircraft.crew.recurringIssues.length === 0 && aircraft.crew.observations.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No crew reports</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Timeline */}
            <section id="timeline" className="space-y-4">
              <h2 className="text-xl font-semibold">Timeline</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                    {aircraft.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{event.description}</p>
                              <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                              {event.actor && (
                                <p className="text-xs text-muted-foreground mt-1">by {event.actor}</p>
                              )}
                            </div>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Playbooks & Actions */}
            <section id="playbooks" className="space-y-4">
              <h2 className="text-xl font-semibold">Playbooks & Actions</h2>
              
              {aircraft.actions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aircraft.actions.map((action, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{action.title}</CardTitle>
                            <CardDescription className="mt-1">{action.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{action.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button size="sm" variant="default" className="w-full">
                          {action.type === 'playbook' ? 'Run Playbook' : action.type === 'task' ? 'Open Tasks' : 'Send Alert'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No playbooks configured</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
