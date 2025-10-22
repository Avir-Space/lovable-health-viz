interface TableChartProps {
  rows: any[];
}

export function TableChart({ rows }: TableChartProps) {
  if (!rows || rows.length === 0) {
    return <div className="text-sm text-muted-foreground py-8 text-center">No data available</div>;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="overflow-auto max-h-72">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-background border-b">
          <tr>
            {columns.map(col => (
              <th key={col} className="text-left px-3 py-2 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-muted/50">
              {columns.map(col => {
                const value = row[col];
                const isNumeric = typeof value === 'number';
                return (
                  <td 
                    key={col} 
                    className={`px-3 py-2 ${isNumeric ? 'text-right' : 'text-left'}`}
                  >
                    {isNumeric ? value.toFixed(2) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
