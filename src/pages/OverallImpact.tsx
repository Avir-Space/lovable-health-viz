import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useImpactOverall } from '@/hooks/useImpactOverall';
import { Loader2 } from 'lucide-react';
import EChart from '@/components/charts/EChart';
import { fmt } from '@/lib/num';


export default function OverallImpact() {
  const { kpis, isLoading, error } = useImpactOverall('30d');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Overall Impact</h1>
          <p className="text-muted-foreground">
            View fleet-wide impact of AI interventions across all modules
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin mr-2 h-8 w-8" />
          <span className="text-muted-foreground">Loading impact data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('[Overall Impact] Error loading data:', error);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Overall Impact</h1>
        <p className="text-muted-foreground">
          View fleet-wide impact of AI interventions across all modules
        </p>
      </div>

      {kpis.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No impact data available for this view yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi) => {
            const latestValue = kpi.latestValue ?? 0;

            // Prepare chart data
            const chartOption = {
              grid: { top: 40, right: 20, bottom: 40, left: 60 },
              xAxis: {
                type: 'category',
                data: kpi.timeseries.map((p) => {
                  const date = new Date(p.ts);
                  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }),
                axisLabel: { rotate: 45, fontSize: 11 },
              },
              yAxis: {
                type: 'value',
                name: kpi.unit,
                nameLocation: 'middle',
                nameGap: 45,
                axisLabel: {
                  formatter: (value: number) => fmt(value),
                },
              },
              series: [
                {
                  data: kpi.timeseries.map((p) => p.value),
                  type: 'line',
                  smooth: true,
                  areaStyle: {
                    opacity: 0.2,
                  },
                  lineStyle: {
                    width: 2,
                  },
                  itemStyle: {
                    color: 'hsl(var(--primary))',
                  },
                },
              ],
              tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                  const param = params[0];
                  return `${param.axisValue}<br/>${fmt(param.value)} ${kpi.unit}`;
                },
              },
            };

            return (
              <Card key={kpi.kpi_key} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{kpi.label}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {fmt(latestValue)}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {kpi.unit}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <EChart option={chartOption} height={200} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
