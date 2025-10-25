import { KpiCard } from '@/components/kpi/KpiCard';

export default function OpsDispatchReliability() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ops & Dispatch Reliability</h1>
        <p className="text-muted-foreground">
          Track on-time performance, delays, cancellations, and operational metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="ops-dispatch-reliability:dispatch_reliability" title="Dispatch Reliability" variant="gauge" />
        <KpiCard kpiKey="ops-dispatch-reliability:tech_delays_count_minutes" title="Tech Delays (Count & Minutes)" variant="line" />
        <KpiCard kpiKey="ops-dispatch-reliability:cancellations_mx_related" title="Cancellations (MX Related)" variant="bar" />
        <KpiCard kpiKey="ops-dispatch-reliability:delay_categories" title="Delay Categories" variant="pie" />
      </div>
    </div>
  );
}
