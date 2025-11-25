import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Activity, Gauge, Calendar, AlertTriangle } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Aircraft = Tables<'aircraft'>;
type AircraftCounter = Tables<'aircraft_counters'>;

interface AircraftDrawerProps {
  aircraft: Aircraft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AircraftDrawer({ aircraft, open, onOpenChange }: AircraftDrawerProps) {
  const [counters, setCounters] = useState<AircraftCounter[]>([]);
  const [loadingCounters, setLoadingCounters] = useState(false);

  useEffect(() => {
    if (aircraft && open) {
      fetchCounters(aircraft.id);
    }
  }, [aircraft, open]);

  const fetchCounters = async (aircraftId: string) => {
    setLoadingCounters(true);
    try {
      const { data, error } = await supabase
        .from('aircraft_counters')
        .select('*')
        .eq('aircraft_id', aircraftId)
        .in('counter_key', ['ttaf', 'landings', 'eng1_tsn', 'eng2_tsn']);

      if (error) throw error;
      setCounters(data || []);
    } catch (error) {
      console.error('Error fetching counters:', error);
    } finally {
      setLoadingCounters(false);
    }
  };

  if (!aircraft) return null;

  const getReadinessBadge = (status: string | null) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-600">Ready</Badge>;
      case 'in_maintenance':
        return <Badge variant="secondary">In Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            {aircraft.registration}
          </SheetTitle>
          <SheetDescription>
            Aircraft quick preview and details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Fleet Type</div>
                <div className="font-medium">{aircraft.fleet_type || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Base Airport</div>
                <div className="font-medium">{aircraft.base_airport_code || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Serial Number</div>
                <div className="font-medium">{aircraft.serial_number || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Operator</div>
                <div className="font-medium">{aircraft.operator_name || '-'}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Readiness</span>
                {getReadinessBadge(aircraft.readiness_status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Airworthiness</span>
                <Badge variant={aircraft.airworthiness_state === 'airworthy' ? 'default' : 'destructive'}>
                  {aircraft.airworthiness_state || 'Unknown'}
                </Badge>
              </div>
              {aircraft.is_aog && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AOG Status</span>
                  <Badge variant="destructive" className="font-semibold">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    AOG
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Health Index</span>
                <span className="font-medium">
                  {aircraft.health_index !== null ? `${aircraft.health_index.toFixed(1)}%` : '-'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Maintenance */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Maintenance Schedule
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Next Maintenance</div>
                <div className="font-medium">
                  {aircraft.predicted_next_maintenance_at ? (
                    <>
                      {format(new Date(aircraft.predicted_next_maintenance_at), 'PPP')}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({formatDistanceToNow(new Date(aircraft.predicted_next_maintenance_at), {
                          addSuffix: true,
                        })})
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Next Compliance</div>
                <div className="font-medium">
                  {aircraft.predicted_next_compliance_at ? (
                    <>
                      {format(new Date(aircraft.predicted_next_compliance_at), 'PPP')}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({formatDistanceToNow(new Date(aircraft.predicted_next_compliance_at), {
                          addSuffix: true,
                        })})
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Last Departure</div>
                <div className="font-medium">
                  {aircraft.last_departure_airport || '-'}
                  {aircraft.last_flight_departure_at && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDistanceToNow(new Date(aircraft.last_flight_departure_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Last Arrival</div>
                <div className="font-medium">
                  {aircraft.last_arrival_airport || '-'}
                  {aircraft.last_flight_arrival_at && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDistanceToNow(new Date(aircraft.last_flight_arrival_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
              {(aircraft.last_known_lat !== null && aircraft.last_known_lon !== null) && (
                <Card className="bg-muted/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Last Known Position</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="font-mono">{aircraft.last_known_lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="font-mono">{aircraft.last_known_lon.toFixed(6)}</span>
                    </div>
                    {aircraft.last_known_altitude_ft !== null && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Altitude:</span>
                        <span className="font-mono">{aircraft.last_known_altitude_ft} ft</span>
                      </div>
                    )}
                    {aircraft.last_known_speed_kt !== null && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="font-mono">{aircraft.last_known_speed_kt} kt</span>
                      </div>
                    )}
                    {aircraft.last_position_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated:</span>
                        <span>
                          {formatDistanceToNow(new Date(aircraft.last_position_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    )}
                    {aircraft.last_position_source && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Source:</span>
                        <span className="uppercase">{aircraft.last_position_source}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Separator />

          {/* Counters */}
          <div className="space-y-3">
            <h4 className="font-semibold">Aircraft Counters</h4>
            {loadingCounters ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : counters.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {counters.map((counter) => (
                  <Card key={counter.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase text-muted-foreground">
                        {counter.counter_key.replace(/_/g, ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {counter.current_value?.toLocaleString() || '-'}
                      </div>
                      {counter.unit && (
                        <div className="text-xs text-muted-foreground">{counter.unit}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No counter data available
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
