import { useDashboardKpis, type KpiRange } from "@/hooks/useKpiData";
import { KpiCardBackendDriven } from "@/components/KpiCardBackendDriven";

interface DashboardPageProps {
  dashboard: string;
  title: string;
  subtitle?: string;
  defaultRange?: KpiRange;
}

export default function DashboardPage({ 
  dashboard, 
  title, 
  subtitle, 
  defaultRange = "1M" 
}: DashboardPageProps) {
  const { kpis, isLoading, error } = useDashboardKpis(dashboard);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      )}

      {error && (
        <div className="text-sm text-destructive">
          Failed to load dashboard: {String((error as any)?.message || error)}
        </div>
      )}

      {!isLoading && !error && kpis.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No KPIs found for dashboard <code className="px-1 py-0.5 bg-muted rounded">{dashboard}</code>.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map(meta => (
          <KpiCardBackendDriven 
            key={meta.kpi_key} 
            kpiMeta={meta} 
            useLiveData 
            defaultRange={defaultRange} 
          />
        ))}
      </div>
    </div>
  );
}
