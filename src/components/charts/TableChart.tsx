export default function TableChart({ rows }: { rows: any[] }) {
  if (!rows || rows.length === 0) return <div className="text-sm text-muted-foreground p-6">No data available</div>;
  const columns = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>{columns.map(c => <th key={c} className="px-3 py-2 text-left font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {columns.map(c => <td key={c} className="px-3 py-2">{typeof r[c] === 'number' ? r[c].toFixed(2) : String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
