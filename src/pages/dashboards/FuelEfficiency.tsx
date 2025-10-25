import { KpiCard } from '@/components/kpi/KpiCard';

export default function FuelEfficiency() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fuel Efficiency</h1>
        <p className="text-muted-foreground">
          Monitor fuel consumption, cost per flight, and efficiency trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="fuel-efficiency:fuel_consumption_per_flight" title="Fuel Consumption per Flight" variant="line" />
        <KpiCard kpiKey="fuel-efficiency:fuel_cost_per_flight" title="Fuel Cost per Flight" variant="line" />
        <KpiCard kpiKey="fuel-efficiency:fuel_efficiency_trend" title="Fuel Efficiency Trend" variant="line" />
        <KpiCard kpiKey="fuel-efficiency:fuel_usage_by_route" title="Fuel Usage by Route" variant="bar" />
      </div>
    </div>
  );
}
