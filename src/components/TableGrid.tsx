function renderCell(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'number') return val.toLocaleString();
  if (typeof val === 'string') {
    // ISO date → readable
    if (/^\d{4}-\d{2}-\d{2}T/.test(val)) {
      return val.replace('T', ' ').replace('Z', '').slice(0, 19);
    }
    return val.length > 60 ? val.slice(0, 57) + '…' : val;
  }
  if (typeof val === 'object') {
    try {
      const sorted = JSON.stringify(
        val,
        Object.keys(val as any).sort()
      );
      return sorted.length > 60 ? sorted.slice(0, 57) + '…' : sorted;
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export default function TableGrid({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="text-[12px] text-muted-foreground py-8 text-center">
        No data available
      </div>
    );
  }

  // Hide noisy/internal columns by default
  const HIDDEN = new Set(['kpi_key', '__k', '__meta', '__metadata', 'id']);
  // Soft-rename snapshot_ts
  const LABEL: Record<string, string> = { snapshot_ts: 'Date' };

  // Build column set from the first row
  const keys = Object.keys(rows[0] || {}).filter((k) => !HIDDEN.has(k));
  const preferred = [
    'Row',
    'row',
    'Name',
    'name',
    'Category',
    'category',
    'Metric',
    'metric',
    'Value',
    'value',
    'UpdatedAt',
    'updated_at',
    'snapshot_ts',
    'ts',
    'date',
  ];
  const ordered = [
    ...preferred.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !preferred.includes(k)),
  ];
  const cols = ordered.slice(0, 6);

  return (
    <div className="h-full flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-background z-10">
            <tr className="border-b">
              {cols.map((c) => (
                <th
                  key={c}
                  className="px-3 py-2 text-left font-medium"
                  title={c}
                >
                  {LABEL[c] ?? c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {rows.slice(0, 20).map((r, i) => (
              <tr
                key={i}
                className="border-b last:border-b-0 even:bg-muted/40"
              >
                {cols.map((c) => (
                  <td key={c} className="px-3 py-2">
                    {renderCell(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 20 && (
        <div className="mt-2 text-[10px] text-muted-foreground text-center">
          … {rows.length - 20} more row{rows.length - 20 !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
