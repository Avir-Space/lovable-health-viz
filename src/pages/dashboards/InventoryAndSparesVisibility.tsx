import { KpiCard } from '@/components/kpi/KpiCard';

export default function InventoryAndSparesVisibility() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Inventory & Spares Visibility</h1>
        <p className="text-muted-foreground">
          Monitor stock levels, AOG parts, and spares utilization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="inventory-spares-visibility:stock_levels_by_category" title="Stock Levels by Category" variant="bar" />
        <KpiCard kpiKey="inventory-spares-visibility:aog_parts_pending" title="AOG Parts Pending" variant="line" />
        <KpiCard kpiKey="inventory-spares-visibility:spares_utilization" title="Spares Utilization" variant="gauge" />
        <KpiCard kpiKey="inventory-spares-visibility:critical_stock_items" title="Critical Stock Items" variant="table" />
      </div>
    </div>
  );
}
