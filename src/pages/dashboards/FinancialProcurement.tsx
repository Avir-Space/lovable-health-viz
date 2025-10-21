import { financialKPIs } from "@/data/financialKPIs";
import { KpiCard } from "@/components/KpiCard";

export default function FinancialProcurement() {
  const getSourcesForKPI = (key: string): string[] => {
    if (key.includes("budget") || key.includes("cost") || key.includes("po")) return ["SAP", "Ramco"];
    if (key.includes("vendor") || key.includes("warranty")) return ["SAP", "Ramco", "AMOS"];
    return ["SAP", "Ramco"];
  };


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial & Procurement View</h1>
        <p className="text-muted-foreground">Real-time financial performance, procurement metrics, and budget tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialKPIs.map((kpi) => (
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
