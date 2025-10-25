export default function TableGrid({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) return <div className="text-xs text-muted-foreground">No rows.</div>;

  // Hide noisy/internal columns by default
  const HIDDEN = new Set(['kpi_key','__k','__meta','__metadata','id']);
  // Soft-rename snapshot_ts
  const LABEL: Record<string,string> = { snapshot_ts: 'Date' };

  // Build column set from the first row
  const keys = Object.keys(rows[0] || {}).filter(k => !HIDDEN.has(k));
  const preferred = ['Row','row','Name','name','Category','category','Metric','metric','Value','value','UpdatedAt','updated_at','snapshot_ts','ts','date'];
  const ordered = [...preferred.filter(k => keys.includes(k)), ...keys.filter(k => !preferred.includes(k))];
  const cols = ordered.slice(0, 6);

  const fmt = (v: any) => {
    if (v == null) return '';
    if (typeof v === 'number') return v.toLocaleString();
    if (typeof v === 'string') {
      // ISO → readable
      if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v.replace('T',' ').replace('Z','');
      return v.length > 60 ? v.slice(0,57) + '…' : v;
    }
    try {
      const s = JSON.stringify(v);
      return s.length > 60 ? s.slice(0,57) + '…' : s;
    } catch { return String(v); }
  };

  return (
    <div className="w-full overflow-auto text-[11px] leading-5 max-h-[180px]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} className="text-left border-b py-1 pr-2 font-medium whitespace-nowrap">
                {LABEL[c] ?? c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 20).map((r, i) => (
            <tr key={i} className="align-top">
              {cols.map(c => (
                <td key={c} className="border-b py-1 pr-2 whitespace-nowrap">{fmt(r[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 20 && (
        <div className="mt-1 text-[10px] text-muted-foreground">… {rows.length - 20} more</div>
      )}
    </div>
  );
}
