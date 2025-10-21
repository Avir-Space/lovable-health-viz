import { maintenanceKPIs, dataSources } from "@/data/maintenanceKPIs";
import { KpiCard } from "@/components/KpiCard";

const getSourcesForKPI = (key: string): string[] => {
  const mroSources = ["AMOS", "TRAX"];
  const erpSources = ["SAP", "Ramco"];
  
  if (key === "fleet_airworthiness_pct") return ["AMOS"];
  if (key.includes("aog") || key.includes("airworthiness")) return mroSources;
  if (key.includes("spare") || key.includes("parts")) return [...erpSources, "AMOS"];
  if (key.includes("work_order") || key.includes("work_packages")) return ["AMOS", "SAP"];
  if (key.includes("tech_delay") || key.includes("deferral") || key.includes("mel")) return ["AMOS", "TRAX"];
  
  const count = Math.floor(Math.random() * 2) + 1;
  const shuffled = [...dataSources].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const aiSuggestions: Record<string, string> = {
  fleet_airworthiness_pct: "Fleet airworthiness is strong at 93%. Consider proactive maintenance for the remaining 7%.",
  aog_events_count_and_minutes: "AOG events spike detected on 2025-09-10. Review DXB station procedures.",
  tech_delay_minutes: "DOH-JFK route shows highest delays. Investigate recurring technical issues.",
  spare_induced_delays_pct: "JFK station shows 10.7% increase in spare-induced delays. Check inventory levels.",
  repeat_defects_30_90d: "Repeat defects detected. Recommend root cause analysis for recurring issues.",
};

export default function MaintenanceHealthOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Maintenance Health Overview</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of fleet maintenance operations and performance indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenanceKPIs.map((kpi) => (
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
            details={{
              why: aiSuggestions[kpi.key] || "System-generated recommendation.",
              evidence: [],
              ifIgnored: "Risk remains for this KPI.",
              ifExecuted: "Expected uplift in KPI performance.",
              confidence: 0.8,
              provenance: getSourcesForKPI(kpi.key),
            }}
          />
        ))}
      </div>
    </div>
  );
}
