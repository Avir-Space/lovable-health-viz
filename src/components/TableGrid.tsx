export default function TableGrid({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) return <div className="text-xs text-muted-foreground">No rows.</div>;

  const sample = rows[0] || {};
  const allCols = Object.keys(sample);
  const preferred = ['Row','row','Name','name','Metric','metric','UpdatedAt','updated_at','snapshot_ts','ts','date'];
  const ordered = [...preferred.filter(c => allCols.includes(c)), ...allCols.filter(c => !preferred.includes(c))];
  const cols = ordered.slice(0, 6);

  const fmt = (v: any) => {
    if (v == null) return '';
    if (typeof v === 'number') return v.toLocaleString();
    if (typeof v === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v.replace('T',' ').replace('Z','');
      return v.length > 60 ? v.slice(0,57) + '…' : v;
    }
    try { const s = JSON.stringify(v); return s.length>60 ? s.slice(0,57)+'…' : s; } catch { return String(v); }
  };

  return (
    <div className="w-full overflow-auto text-[11px] leading-5">
      <table className="w-full border-collapse">
        <thead>
          <tr>{cols.map(c => <th key={c} className="text-left border-b py-1 pr-2 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((r, i) => (
            <tr key={i} className="align-top">
              {cols.map(c => <td key={c} className="border-b py-1 pr-2">{fmt(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 10 && <div className="mt-1 text-[10px] text-muted-foreground">… {rows.length-10} more</div>}
    </div>
  );
}
