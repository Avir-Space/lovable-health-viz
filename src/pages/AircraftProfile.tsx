import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle, TrendingUp, Wrench, FileText, Settings, Scale, History, Sparkles, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAircraftProfile } from '@/data/mockAircraftProfiles';
import { formatDistanceToNow } from 'date-fns';

export default function AircraftProfile() {
  const { aircraftId } = useParams<{ aircraftId: string }>();
  const navigate = useNavigate();
  const aircraft = getAircraftProfile(aircraftId || 'default');

  const sections = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'flight-activity', label: 'Flight Activity', icon: Plane },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'work-orders', label: 'Work Orders', icon: FileText },
    { id: 'defects', label: 'Defects & Unscheduled', icon: AlertCircle },
    { id: 'compliance', label: 'Compliance Docs', icon: FileText },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'weight-balance', label: 'Weight & Balance', icon: Scale },
    { id: 'activity-log', label: 'Activity Log', icon: History },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'in_maintenance':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'in-progress':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'closed':
      case 'compliant':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'overdue':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'high':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const daysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/aircraft')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Aircraft List
          </Button>
          <h1 className="text-2xl font-bold">
            Aircraft Profile · {aircraft.registration}
          </h1>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="border-b bg-muted/20 sticky top-[73px] z-10">
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Fleet Type</p>
              <p className="font-medium">{aircraft.fleetType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Serial Number</p>
              <p className="font-medium">{aircraft.serialNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Base Airport</p>
              <p className="font-medium">{aircraft.baseAirport}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Readiness</p>
              <Badge className={getReadinessColor(aircraft.readinessStatus)}>
                {aircraft.readinessStatus.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Health Index</p>
              <div className="flex items-center gap-2">
                <Progress value={aircraft.healthIndex} className="h-2 flex-1" />
                <span className="font-medium">{aircraft.healthIndex}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Next Maintenance</p>
              <p className="font-medium">
                {daysUntil(aircraft.nextMaintenance)} days
              </p>
            </div>
          </div>
          {aircraft.isAog && (
            <div className="mt-3">
              <Badge variant="destructive">AOG</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation */}
        <nav className="w-56 border-r bg-muted/10 p-4 overflow-y-auto">
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
            {/* Overview */}
            <section id="overview" className="space-y-4">
              <h2 className="text-xl font-semibold">Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Utilization (Last 7 Days)</CardDescription>
                    <CardTitle className="text-2xl">
                      {aircraft.overviewStats.utilizationLast7Days}h
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Flights (Last 30 Days)</CardDescription>
                    <CardTitle className="text-2xl">
                      {aircraft.overviewStats.flightsLast30Days}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Open Work Orders</CardDescription>
                    <CardTitle className="text-2xl">
                      {aircraft.overviewStats.openWorkOrders}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Open Defects</CardDescription>
                    <CardTitle className="text-2xl">
                      {aircraft.overviewStats.openDefects}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardDescription>TTAF</CardDescription>
                    <CardTitle>{aircraft.keyCounters.ttaf.toLocaleString()} hrs</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>Landings</CardDescription>
                    <CardTitle>{aircraft.keyCounters.landings.toLocaleString()}</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>ENG1 TSN</CardDescription>
                    <CardTitle>{aircraft.keyCounters.eng1Tsn.toLocaleString()} hrs</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardDescription>ENG2 TSN</CardDescription>
                    <CardTitle>{aircraft.keyCounters.eng2Tsn.toLocaleString()} hrs</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{aircraft.aiSummary}</p>
                </CardContent>
              </Card>
            </section>

            {/* Flight Activity */}
            <section id="flight-activity" className="space-y-4">
              <h2 className="text-xl font-semibold">Flight Activity</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Last Known Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coordinates:</span>
                      <span className="font-mono">
                        {aircraft.lastPosition.lat.toFixed(4)}, {aircraft.lastPosition.lon.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Altitude:</span>
                      <span>{aircraft.lastPosition.altitude.toLocaleString()} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Speed:</span>
                      <span>{aircraft.lastPosition.speed} kt</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <Badge variant="outline">{aircraft.lastPosition.source}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last seen:</span>
                      <span>{aircraft.lastPosition.lastSeenMinutesAgo} minutes ago</span>
                    </div>
                    <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Live map integration coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Flights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Block</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aircraft.flightActivity.slice(0, 5).map((flight, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs">{flight.date}</TableCell>
                            <TableCell className="text-xs">
                              {flight.from} → {flight.to}
                            </TableCell>
                            <TableCell className="text-xs">{flight.blockTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Maintenance */}
            <section id="maintenance" className="space-y-4">
              <h2 className="text-xl font-semibold">Maintenance</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Next Due Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Basis</TableHead>
                        <TableHead>Due In</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aircraft.maintenanceTasks.map((task, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{task.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {task.basis}
                          </TableCell>
                          <TableCell>{task.dueIn}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {aircraft.counterProjections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Counter Projections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Counter</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>Growth/Day</TableHead>
                          <TableHead>Projected Due</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aircraft.counterProjections.map((proj, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{proj.counterName}</TableCell>
                            <TableCell>{proj.currentValue.toLocaleString()}</TableCell>
                            <TableCell>{proj.growthPerDay}</TableCell>
                            <TableCell>{proj.projectedDueDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Work Orders */}
            <section id="work-orders" className="space-y-4">
              <h2 className="text-xl font-semibold">Work Orders</h2>
              
              <div className="grid gap-4">
                {aircraft.workOrders.map((wo) => (
                  <Card key={wo.woNumber}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{wo.woNumber}</CardTitle>
                          <CardDescription>{wo.title}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(wo.status)}>{wo.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Opened:</span>
                          <p>{wo.openedDate}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Workshop:</span>
                          <p>{wo.assignedWorkshop}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Defects */}
            <section id="defects" className="space-y-4">
              <h2 className="text-xl font-semibold">Defects & Unscheduled</h2>
              
              <Card>
                <CardContent className="pt-6">
                  {aircraft.defects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No open defects</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>ATA</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Opened</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aircraft.defects.map((defect, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {defect.title}
                              {defect.isMel && (
                                <Badge variant="outline" className="ml-2">MEL</Badge>
                              )}
                            </TableCell>
                            <TableCell>{defect.ataChapter}</TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(defect.severity)}>
                                {defect.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{defect.openedDate}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(defect.status)}>
                                {defect.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Compliance */}
            <section id="compliance" className="space-y-4">
              <h2 className="text-xl font-semibold">Compliance Documents</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aircraft.complianceDocs.map((doc, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Badge variant="outline">{doc.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.referenceNumber}
                          </TableCell>
                          <TableCell className="text-sm">{doc.effectiveDate}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Configuration */}
            <section id="configuration" className="space-y-4">
              <h2 className="text-xl font-semibold">Configuration</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mod Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effective Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aircraft.configurationItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{item.modNumber}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{item.effectiveDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

            {/* Weight & Balance */}
            <section id="weight-balance" className="space-y-4">
              <h2 className="text-xl font-semibold">Weight & Balance</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Latest Report</CardTitle>
                  <CardDescription>Report Date: {aircraft.weightBalance.reportDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Empty Weight</p>
                      <p className="text-2xl font-bold">
                        {aircraft.weightBalance.emptyWeight.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max Takeoff Weight</p>
                      <p className="text-2xl font-bold">
                        {aircraft.weightBalance.maxTakeoffWeight.toLocaleString()} kg
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <Button variant="outline" disabled>
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Activity Log */}
            <section id="activity-log" className="space-y-4">
              <h2 className="text-xl font-semibold">Activity Log</h2>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {aircraft.activityLog.map((event, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                        <div className="flex-shrink-0 w-32 text-sm text-muted-foreground">
                          {event.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {event.eventType}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{event.actor}</span>
                          </div>
                          <p className="text-sm">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* AI Insights */}
            <section id="ai-insights" className="space-y-4">
              <h2 className="text-xl font-semibold">AI Insights</h2>
              
              <div className="grid gap-4">
                {aircraft.aiInsights.map((insight, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                        </div>
                        <Badge variant="outline">{insight.label}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
