import { inventoryKPIs, dataSources } from "@/data/inventoryKPIs";
import { KPICard } from "@/components/dashboard/KPICard";
import { GaugeChart } from "@/components/dashboard/charts/GaugeChart";
import { TableChart } from "@/components/dashboard/charts/TableChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import { HeatmapChart } from "@/components/dashboard/charts/HeatmapChart";
import { NumericChart } from "@/components/dashboard/charts/NumericChart";

const getSourcesForKPI = (key: string): string[] => {
  const erpInventorySources = ["SAP", "Ramco"];
  const mroSources = ["AMOS", "TRAX"];
  
  if (key.includes("stock") || key.includes("inventory") || key.includes("spares") || key.includes("parts")) {
    return [...erpInventorySources, ...mroSources.slice(0, 1)];
  }
  
  if (key.includes("vendor") || key.includes("repair")) {
    return ["SAP", "AMOS"];
  }
  
  return erpInventorySources;
};

const aiSuggestions: Record<string, string> = {
  stock_availability_pct: "Stock availability at 89% is healthy. Monitor critical items to prevent stockouts.",
  critical_items_low_stock: "3 critical items at risk. Recommend immediate procurement for PN-A123 and PN-B221.",
  stockouts_by_base: "DXB shows highest stockouts (12). Consider increasing safety stock levels.",
  aging_of_spares: "42 items aged 180d+. Review for obsolescence and potential write-off.",
  vendor_performance_score: "All vendors above 89%. Lufthansa Tech leading at 96%.",
};

export default function InventoryAndSparesVisibility() {
  const renderChart = (kpi: typeof inventoryKPIs[0]) => {
    const xKey = kpi.columns[0];
    const yKey = kpi.columns[1];

    switch (kpi.variant) {
      case "gauge":
        return <GaugeChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      
      case "table":
        return <TableChart data={kpi.data} columns={kpi.columns} />;
      
      case "line":
        return (
          <LineChart
            data={kpi.data}
            xKey={xKey}
            yKey={yKey}
            xLabel={kpi.xAxis}
            yLabel={kpi.yAxis}
          />
        );
      
      case "bar":
        return (
          <BarChart
            data={kpi.data}
            xKey={xKey}
            yKey={yKey}
            xLabel={kpi.xAxis}
            yLabel={kpi.yAxis}
          />
        );
      
      case "pie":
        return <PieChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      
      case "heatmap":
        return (
          <HeatmapChart
            data={kpi.data}
            xKey={xKey}
            yKey={yKey}
            xLabel={kpi.xAxis}
            yLabel={kpi.yAxis}
          />
        );
      
      case "numeric":
        return <NumericChart data={kpi.data} yKey={yKey} />;
      
      default:
        return <div className="text-muted-foreground">Chart type not implemented</div>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory & Spares Visibility</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of inventory levels, spares availability, and supply chain performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryKPIs.map((kpi) => (
          <KPICard
            key={kpi.key}
            title={kpi.name}
            sources={getSourcesForKPI(kpi.key)}
            aiSuggestion={aiSuggestions[kpi.key]}
          >
            {renderChart(kpi)}
          </KPICard>
        ))}
      </div>
    </div>
  );
}
