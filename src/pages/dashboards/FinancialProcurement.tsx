import { KpiCard } from '@/components/kpi/KpiCard';

export default function FinancialProcurement() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial & Procurement</h1>
        <p className="text-muted-foreground">
          Track maintenance costs, procurement spend, and budget utilization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="financial-procurement:maintenance_cost_per_flight_hour" title="Maintenance Cost per Flight Hour" variant="line" />
        <KpiCard kpiKey="financial-procurement:procurement_spend_by_category" title="Procurement Spend by Category" variant="bar" />
        <KpiCard kpiKey="financial-procurement:budget_utilization" title="Budget Utilization" variant="gauge" />
        <KpiCard kpiKey="financial-procurement:pending_invoices" title="Pending Invoices" variant="table" />
      </div>
    </div>
  );
}
