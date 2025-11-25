import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Wrench, AlertTriangle, Calendar, Activity } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { format, formatDistanceToNow } from 'date-fns';

type Aircraft = Tables<'aircraft'>;

interface FleetSummaryBarProps {
  aircraft: Aircraft[];
}

export function FleetSummaryBar({ aircraft }: FleetSummaryBarProps) {
  const stats = useMemo(() => {
    const total = aircraft.length;
    const ready = aircraft.filter(ac => ac.readiness_status === 'ready').length;
    const inMaintenance = aircraft.filter(ac => ac.readiness_status === 'in_maintenance').length;
    const aog = aircraft.filter(ac => ac.is_aog).length;

    // Find earliest predicted maintenance
    const maintenanceDates = aircraft
      .filter(ac => ac.predicted_next_maintenance_at)
      .map(ac => new Date(ac.predicted_next_maintenance_at!))
      .sort((a, b) => a.getTime() - b.getTime());
    const earliestMaintenance = maintenanceDates[0];

    // Calculate average health index
    const healthIndices = aircraft
      .filter(ac => ac.health_index !== null)
      .map(ac => ac.health_index!);
    const avgHealth = healthIndices.length > 0
      ? healthIndices.reduce((sum, val) => sum + val, 0) / healthIndices.length
      : null;

    return {
      total,
      ready,
      inMaintenance,
      aog,
      earliestMaintenance,
      avgHealth,
    };
  }, [aircraft]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Total Aircraft
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.ready}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            In Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.inMaintenance}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            AOG
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {stats.aog}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Next Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {stats.earliestMaintenance ? (
              <>
                <div className="font-bold">{format(stats.earliestMaintenance, 'MMM dd')}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(stats.earliestMaintenance, { addSuffix: true })}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">N/A</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Avg Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.avgHealth !== null ? `${stats.avgHealth.toFixed(1)}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
