import { inventoryKPIs, dataSources } from "@/data/inventoryKPIs";
import { KpiCard } from "@/components/KpiCard";

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
          <KpiCard
            key={kpi.key}
            kpiKey={kpi.key}
            name={kpi.name}
            sources={getSourcesForKPI(kpi.key).map(s => ({ name: s }))}
            lastSyncedAt="Synced a few seconds ago"
            variant={kpi.variant as any}
            xAxis={kpi.xAxis}
            yAxis={kpi.yAxis}
            data={kpi.data}
            columns={kpi.columns}
            aiInsight={aiSuggestions[kpi.key]}
            actions={aiSuggestions[kpi.key] ? [{ label: "View Details", id: "primary", variant: "primary" }] : []}
            details={{
              why: aiSuggestions[kpi.key] || "System-generated recommendation.",
              evidence: [],
              confidence: 0.85,
              provenance: getSourcesForKPI(kpi.key)
            }}
            defaultRange="1M"
            ranges={["1D", "1W", "2W", "1M", "6M", "1Y"]}
            allowEdit
            allowInfo
            allowGenAi
            allowOptions
          />
        ))}
      </div>
    </div>
  );
}
