import { useDashboardKpis } from "@/hooks/useKpiData";
import { KpiCardBackendDriven } from "@/components/KpiCardBackendDriven";

const getSourcesForKPI = (key: string): string[] => {
  const mroSources = ["AMOS", "TRAX"];
  const erpSources = ["SAP", "Ramco"];
  
  if (key === "fleet_airworthiness_pct") return ["AMOS"];
  if (key.includes("aog") || key.includes("airworthiness")) return mroSources;
  if (key.includes("spare") || key.includes("parts")) return [...erpSources, "AMOS"];
  if (key.includes("work_order") || key.includes("work_packages")) return ["AMOS", "SAP"];
  if (key.includes("tech_delay") || key.includes("deferral") || key.includes("mel")) return ["AMOS", "TRAX"];
  
  return ["AMOS"];
};


export default function MaintenanceHealthOverview() {
  const { kpis, isLoading, error } = useDashboardKpis('maintenance');

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Maintenance Health Overview</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of fleet maintenance operations and performance indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <KpiCardBackendDriven
            key={kpi.kpi_key}
            kpiMeta={{
              kpi_key: kpi.kpi_key,
              name: kpi.name,
              variant: kpi.variant,
              unit: kpi.unit,
              x_axis: kpi.x_axis,
              y_axis: kpi.y_axis,
              config: kpi.config
            }}
            sources={getSourcesForKPI(kpi.kpi_key).map(s => ({ name: s }))}
            useLiveData={true}
            defaultRange="1M"
          />
        ))}
      </div>
    </div>
  );
}
