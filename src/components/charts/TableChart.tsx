export function TableChart({ rows }:{ rows: any[] }) {
  if (!rows || rows.length === 0) return <div className="text-sm text-muted-foreground">No data</div>;
  const cols = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>{cols.map(c=>(<th key={c} className="text-left p-2 border-b">{c}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((r, i)=>(
            <tr key={i} className="border-b">
              {cols.map(c=>(<td key={c} className="p-2">{typeof r[c]==='number'? r[c].toFixed(2): String(r[c])}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
