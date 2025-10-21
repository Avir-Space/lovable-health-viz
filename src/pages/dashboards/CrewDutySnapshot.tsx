import { crewKPIs } from "@/data/crewKPIs";
import { KpiCard } from "@/components/KpiCard";

export default function CrewDutySnapshot() {
  const getSourcesForKPI = (key: string): string[] => {
    if (key.includes("crew") || key.includes("pairing") || key.includes("fdp")) return ["AIMS", "Jeppesen"];
    if (key.includes("training") || key.includes("sick")) return ["AIMS", "SAP"];
    return ["AIMS", "Jeppesen"];
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crew & Duty Snapshot</h1>
        <p className="text-muted-foreground">Real-time crew utilization, fatigue management, and duty compliance tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewKPIs.map((kpi) => (
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
            details={{
              why: "System-generated recommendation.",
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
