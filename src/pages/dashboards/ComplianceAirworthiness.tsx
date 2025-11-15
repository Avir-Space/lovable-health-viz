import { useDashboardKpis } from '@/hooks/useKpiData';
import KpiCardBackendDriven from '@/components/KpiCardBackendDriven';
import { Loader2 } from 'lucide-react';
import { useComplianceBenchmarks } from '@/hooks/useComplianceBenchmarks';

const DASHBOARD_KEY = 'compliance-airworthiness';

export default function ComplianceAirworthiness() {
  const { kpis, isLoading, error } = useDashboardKpis(DASHBOARD_KEY);
  const { benchmarks } = useComplianceBenchmarks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin mr-2 h-6 w-6" />
        <span className="text-sm text-muted-foreground">Loading dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load KPI list: {String(error)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compliance & Airworthiness</h1>
        <p className="text-muted-foreground">
          Track regulatory compliance, certifications, and airworthiness status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 avir-two-col">
        {kpis.map((k) => {
          const bm = benchmarks?.[k.kpi_key];
          const overrideStats = bm
            ? {
                currentValue: bm.current_value,
                previousValue: bm.last_period_value,
                unit: bm.unit,
                targetBand: bm.target_band,
                aiSummaryText: bm.ai_summary_text,
                aiCtaTitle: bm.ai_recommendation_title,
                aiCtaLabel: bm.ai_recommendation_cta_label,
              }
            : undefined;

          return (
            <KpiCardBackendDriven
              key={k.kpi_key}
              kpi_key={k.kpi_key}
              name={k.name}
              variant={k.variant as any}
              unit={k.unit}
              defaultRange="1M"
              useLiveData={true}
              dashboard={DASHBOARD_KEY}
              overrideStats={overrideStats}
            />
          );
        })}
      </div>
    </div>
  );
}
