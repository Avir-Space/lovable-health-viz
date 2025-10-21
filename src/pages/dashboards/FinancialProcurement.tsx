import { financialKPIs } from "@/data/financialKPIs";
import { KPICard } from "@/components/dashboard/KPICard";
import { TableChart } from "@/components/dashboard/charts/TableChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { NumericChart } from "@/components/dashboard/charts/NumericChart";
import { DeltaChart } from "@/components/dashboard/charts/DeltaChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import { HeatmapChart } from "@/components/dashboard/charts/HeatmapChart";

export default function FinancialProcurement() {
  const getSourcesForKPI = (key: string): string[] => {
    if (key.includes("budget") || key.includes("cost") || key.includes("po")) return ["SAP", "Ramco"];
    if (key.includes("vendor") || key.includes("warranty")) return ["SAP", "Ramco", "AMOS"];
    return ["SAP", "Ramco"];
  };

  const renderChart = (kpi: typeof financialKPIs[0]) => {
    const xKey = kpi.columns[0];
    const yKey = kpi.columns[1];

    switch (kpi.variant) {
      case "table": return <TableChart data={kpi.data} columns={kpi.columns} />;
      case "line": return <LineChart data={kpi.data} xKey={xKey} yKey={yKey} xLabel={kpi.xAxis} yLabel={kpi.yAxis} />;
      case "bar": return <BarChart data={kpi.data} xKey={xKey} yKey={yKey} xLabel={kpi.xAxis} yLabel={kpi.yAxis} />;
      case "numeric": return <NumericChart data={kpi.data} yKey={yKey} />;
      case "delta": return <DeltaChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      case "pie": return <PieChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      case "heatmap": return <HeatmapChart data={kpi.data} xKey={xKey} yKey={yKey} xLabel={kpi.xAxis} yLabel={kpi.yAxis} />;
      default: return <div className="text-muted-foreground">Chart type not implemented</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial & Procurement View</h1>
        <p className="text-muted-foreground">Real-time financial performance, procurement metrics, and budget tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialKPIs.map((kpi) => (
          <KPICard key={kpi.key} title={kpi.name} sources={getSourcesForKPI(kpi.key)}>{renderChart(kpi)}</KPICard>
        ))}
      </div>
    </div>
  );
}
