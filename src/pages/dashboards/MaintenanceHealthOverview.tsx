import { KpiCard } from '@/components/kpi/KpiCard';

export default function MaintenanceHealthOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Maintenance Health Overview</h1>
        <p className="text-muted-foreground">
          Track fleet airworthiness, AOG events, defects, and maintenance backlog
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="maintenance-health-overview:fleet_airworthiness_percent" title="Fleet Airworthiness %" variant="gauge" />
        <KpiCard kpiKey="maintenance-health-overview:aog_events_count_minutes" title="AOG Events (Count & Minutes)" variant="line" />
        <KpiCard kpiKey="maintenance-health-overview:mean_time_to_repair_mttr" title="Mean Time to Repair (MTTR)" variant="line" />
        <KpiCard kpiKey="maintenance-health-overview:repeat_defects_30_90d" title="Repeat Defects (30/90d)" variant="line" />
        <KpiCard kpiKey="maintenance-health-overview:deferral_aging" title="Deferral Aging" variant="bar" />
        <KpiCard kpiKey="maintenance-health-overview:work_order_backlog_aging" title="Work Order Backlog Aging" variant="bar" />
        <KpiCard kpiKey="maintenance-health-overview:scheduled_vs_unscheduled" title="Scheduled vs Unscheduled" variant="pie" />
        <KpiCard kpiKey="maintenance-health-overview:airworthiness_status_by_aircraft" title="Airworthiness Status by Aircraft" variant="table" />
        <KpiCard kpiKey="maintenance-health-overview:deferral_count" title="Deferral Count" variant="table" />
        <KpiCard kpiKey="maintenance-health-overview:mel_cdl_items_open" title="MEL/CDL Items Open" variant="table" />
      </div>
    </div>
  );
}
