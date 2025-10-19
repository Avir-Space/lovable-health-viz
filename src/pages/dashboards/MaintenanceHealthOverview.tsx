import { maintenanceKPIs, dataSources } from "@/data/maintenanceKPIs";
import { KPICard } from "@/components/dashboard/KPICard";
import { GaugeChart } from "@/components/dashboard/charts/GaugeChart";
import { TableChart } from "@/components/dashboard/charts/TableChart";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { PieChart } from "@/components/dashboard/charts/PieChart";
import { HeatmapChart } from "@/components/dashboard/charts/HeatmapChart";
import { DeltaChart } from "@/components/dashboard/charts/DeltaChart";
import { NumericChart } from "@/components/dashboard/charts/NumericChart";
import { TimelineChart } from "@/components/dashboard/charts/TimelineChart";

const getRandomSources = () => {
  const count = Math.floor(Math.random() * 3) + 1;
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
  const renderChart = (kpi: typeof maintenanceKPIs[0]) => {
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
      
      case "line+numeric":
        const additionalKeys = kpi.columns.slice(2);
        return (
          <LineChart
            data={kpi.data}
            xKey={xKey}
            yKey={yKey}
            xLabel={kpi.xAxis}
            yLabel={kpi.yAxis}
            additionalKeys={additionalKeys}
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
      
      case "delta":
        return <DeltaChart data={kpi.data} xKey={xKey} yKey={yKey} />;
      
      case "numeric":
        return <NumericChart data={kpi.data} yKey={yKey} />;
      
      case "timeline":
        return (
          <TimelineChart
            data={kpi.data}
            xKey={xKey}
            yKey={yKey}
            xLabel={kpi.xAxis}
            yLabel={kpi.yAxis}
          />
        );
      
      default:
        return <div className="text-muted-foreground">Chart type not implemented</div>;
    }
  };

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
          <KPICard
            key={kpi.key}
            title={kpi.name}
            sources={getRandomSources()}
            aiSuggestion={aiSuggestions[kpi.key]}
          >
            {renderChart(kpi)}
          </KPICard>
        ))}
      </div>
    </div>
  );
}
