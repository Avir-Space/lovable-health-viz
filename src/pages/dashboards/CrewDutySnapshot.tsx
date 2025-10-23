import { useDashboardKpis } from '@/hooks/useKpiData';
import { KpiCardBackendDriven } from '@/components/KpiCardBackendDriven';

export default function CrewDutySnapshot() {
  const { kpis, isLoading, error } = useDashboardKpis('crew-duty-snapshot');
  if (isLoading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-destructive">Failed to load.</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Crew & Duty Snapshot</h1>
        <p className="text-sm text-muted-foreground">Duty compliance, rest compliance, fatigue risk</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {kpis.map(k => (
          <KpiCardBackendDriven key={k.kpi_key} kpiMeta={k} useLiveData defaultRange="1M" />
        ))}
      </div>
    </div>
  );
}
