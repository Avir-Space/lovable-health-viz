export default function TableGrid({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) return <div className="text-xs text-muted-foreground">No rows.</div>;
  const cols = Object.keys(rows[0]).slice(0, 6); // keep table compact
  return (
    <div className="w-full overflow-auto text-xs">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols.map(c => <th key={c} className="text-left border-b py-1 pr-2">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((r, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c} className="border-b py-1 pr-2">
                  {typeof r[c] === 'number' ? r[c].toLocaleString() : String(r[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 8 && <div className="mt-1 text-[10px] text-muted-foreground">… {rows.length - 8} more</div>}
    </div>
  );
}
