import { crewKPIs } from "@/data/crewKPIs";
import { KPICard } from "@/components/dashboard/KPICard";
import { GaugeChart } from "@/components/dashboard/charts/GaugeChart";
import { TableChart } from "@/components/dashboard/charts/TableChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { NumericChart } from "@/components/dashboard/charts/NumericChart";

export default function CrewDutySnapshot() {
  const getSourcesForKPI = (key: string): string[] => {
    if (key.includes("crew") || key.includes("pairing") || key.includes("fdp")) return ["AIMS", "Jeppesen"];
    if (key.includes("training") || key.includes("sick")) return ["AIMS", "SAP"];
    return ["AIMS", "Jeppesen"];
  };

  const renderChart = (kpi: typeof crewKPIs[0]) => {
    const xKey = kpi.columns[0];
    const yKey = kpi.columns[1];

    switch (kpi.variant) {
      case "gauge": return <GaugeChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      case "table": return <TableChart data={kpi.data} columns={kpi.columns} />;
      case "line": return <LineChart data={kpi.data} xKey={xKey} yKey={yKey} xLabel={kpi.xAxis} yLabel={kpi.yAxis} />;
      case "bar": return <BarChart data={kpi.data} xKey={xKey} yKey={yKey} xLabel={kpi.xAxis} yLabel={kpi.yAxis} />;
      case "numeric": return <NumericChart data={kpi.data} yKey={yKey} />;
      default: return <div className="text-muted-foreground">Chart type not implemented</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crew & Duty Snapshot</h1>
        <p className="text-muted-foreground">Real-time crew utilization, fatigue management, and duty compliance tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewKPIs.map((kpi) => (
          <KPICard key={kpi.key} title={kpi.name} sources={getSourcesForKPI(kpi.key)}>{renderChart(kpi)}</KPICard>
        ))}
      </div>
    </div>
  );
}
