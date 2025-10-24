import { useDashboardKpis } from '@/hooks/useKpiData';
import { KpiCardBackendDriven } from '@/components/KpiCardBackendDriven';

export default function FuelEfficiency() {
  const { kpis, isLoading, error } = useDashboardKpis('fuel-efficiency');

  if (isLoading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-destructive">Failed to load dashboard</div>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Fuel & Efficiency</h1>
        <p className="text-sm text-muted-foreground">APU usage, taxi fuel, burn variance, ETOPS</p>
      </div>
      <div className="p-6 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3 auto-rows-[minmax(340px,auto)]">
        {kpis.map(k => (
          <KpiCardBackendDriven key={k.kpi_key} kpiMeta={k} useLiveData defaultRange="1M" />
        ))}
      </div>
    </div>
  );
}
