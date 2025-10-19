import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/KPICard";
import { LineChart } from "@/components/dashboard/charts/LineChart";
import { BarChart } from "@/components/dashboard/charts/BarChart";
import { impactKPIs } from "@/data/impactKPIs";

export default function Impact() {
  const renderChart = (kpi: any) => {
    const { variant, data, xAxis, yAxis, columns } = kpi;

    switch (variant) {
      case "line":
        return (
          <LineChart
            data={data}
            xKey={columns[0]}
            yKey={columns[1]}
            xLabel={xAxis}
            yLabel={yAxis}
          />
        );
      case "bar":
        return (
          <BarChart
            data={data}
            xKey={columns[0]}
            yKey={columns[1]}
            xLabel={xAxis}
            yLabel={yAxis}
          />
        );
      default:
        return <div className="h-64 flex items-center justify-center text-muted-foreground">Chart not available</div>;
    }
  };

  const renderKPICards = () => {
    return impactKPIs.map((kpi) => (
      <KPICard
        key={kpi.key}
        title={kpi.name}
        sources={kpi.sources}
        aiSuggestion={kpi.aiInsight}
        aiAction={kpi.aiAction}
      >
        {renderChart(kpi)}
      </KPICard>
    ));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Impact Analysis</h1>
        <p className="text-muted-foreground">
          View operational impact of AI-driven interventions across all modules
        </p>
      </div>

      <Tabs defaultValue="my-impact" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my-impact">My Impact</TabsTrigger>
          <TabsTrigger value="overall-impact">Overall Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="my-impact" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderKPICards()}
          </div>
        </TabsContent>

        <TabsContent value="overall-impact" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderKPICards()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
