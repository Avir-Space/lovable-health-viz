import { useDashboardKpis } from '@/hooks/useKpiData';
import KpiCardBackendDriven from '@/components/KpiCardBackendDriven';

export default function OpsDispatchReliability() {
  const { kpis, isLoading, error } = useDashboardKpis('ops-dispatch-reliability');

  if (isLoading) return <div className="p-4 text-sm">Loading dashboard…</div>;
  if (error) return <div className="p-4 text-sm text-red-600">Failed to load KPI list.</div>;

  return (
    <div className="p-4 grid gap-4"
      style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {kpis.map(k => (
        <KpiCardBackendDriven
          key={k.kpi_key}
          kpi_key={k.kpi_key}
          name={k.name}
          variant={k.variant as any}
          unit={k.unit}
          defaultRange="1M"
          useLiveData={true}
        />
      ))}
    </div>
  );
}
