import { useDashboardKpis } from '@/hooks/useKpiData';
import KpiCardBackendDriven from '@/components/KpiCardBackendDriven';
import { Loader2 } from 'lucide-react';

const DASHBOARD_KEY = 'inventory-spares-visibility';

export default function InventorySparesVisibility() {
  const { kpis, isLoading, error } = useDashboardKpis(DASHBOARD_KEY);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin mr-2 h-6 w-6" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load KPI list: {String(error)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory & Spares Visibility</h1>
        <p className="text-muted-foreground">
          Track stock levels, reorder points, and spare part availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 avir-two-col">
        {kpis.map((k) => (
          <KpiCardBackendDriven
            key={k.kpi_key}
            kpi_key={k.kpi_key}
            name={k.name}
            variant={k.variant as any}
            unit={k.unit}
            defaultRange="1M"
            useLiveData={true}
            dashboard={DASHBOARD_KEY}
          />
        ))}
      </div>
    </div>
  );
}
