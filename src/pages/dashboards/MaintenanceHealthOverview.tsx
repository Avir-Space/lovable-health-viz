import { useDashboardKpis } from '@/hooks/useKpiData';
import { KpiCardBackendDriven } from '@/components/KpiCardBackendDriven';

export default function MaintenanceHealthOverview() {
  const { kpis, isLoading, error } = useDashboardKpis('maintenance-health-overview');

  if (isLoading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-destructive">Failed to load dashboard</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Maintenance Health Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time monitoring of fleet maintenance operations and performance indicators</p>
      </div>
      <div className="p-6 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-[minmax(340px,auto)]">
        {kpis.map(k => (
          <KpiCardBackendDriven key={k.kpi_key} kpiMeta={k} useLiveData defaultRange="1M" />
        ))}
      </div>
    </div>
  );
}
