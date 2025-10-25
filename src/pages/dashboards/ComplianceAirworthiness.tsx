import { KpiCard } from '@/components/kpi/KpiCard';

export default function ComplianceAirworthiness() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compliance & Airworthiness</h1>
        <p className="text-muted-foreground">
          Monitor regulatory compliance, MEL/CDL items, and airworthiness directives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="compliance-airworthiness:airworthiness_directives_due" title="Airworthiness Directives Due" variant="bar" />
        <KpiCard kpiKey="compliance-airworthiness:mel_cdl_items_open" title="MEL/CDL Items Open" variant="line" />
        <KpiCard kpiKey="compliance-airworthiness:audit_findings_open" title="Audit Findings Open" variant="bar" />
        <KpiCard kpiKey="compliance-airworthiness:compliance_status_by_tail" title="Compliance Status by Tail" variant="table" />
      </div>
    </div>
  );
}
