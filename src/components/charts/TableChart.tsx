import { cn } from '@/lib/utils';

export default function TableChart({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) {
    return <div className="text-sm text-muted-foreground">No data available</div>;
  }

  const columns = Object.keys(rows[0]);

  const formatCell = (val: any): string => {
    if (val == null) return '';
    if (typeof val === 'number') {
      return Number.isInteger(val) ? val.toString() : val.toFixed(2);
    }
    // Format ISO dates
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
      return val.replace('T', ' ').replace('Z', '');
    }
    // Avoid [object Object]
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val);
      } catch {
        return '';
      }
    }
    return String(val);
  };

  return (
    <div className="h-[220px] w-full overflow-hidden rounded-lg border border-border">
      <div className="h-full overflow-auto">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-muted text-muted-foreground z-10">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-2 py-2 text-left font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={idx}
                className={cn(
                  'border-b last:border-b-0',
                  idx % 2 ? 'bg-background' : 'bg-muted/30'
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c}
                    className={cn(
                      'px-2 py-1.5 max-w-[200px] truncate',
                      typeof r[c] === 'number'
                        ? 'text-right tabular-nums'
                        : 'text-foreground'
                    )}
                    title={formatCell(r[c])}
                  >
                    {formatCell(r[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
