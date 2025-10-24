import { useMemo, useState } from 'react';

const PAGE = 8;

export function TableChart({ rows }: { rows: any[] }) {
  const [page, setPage] = useState(0);
  const data = rows || [];
  if (data.length === 0) return <div className="py-8 text-center text-muted-foreground">No data</div>;

  // Hide internal keys & obviously raw ts
  const cols = useMemo(()=>{
    const ks = Object.keys(data[0] ?? {});
    return ks.filter(k => !k.startsWith('__') && !/^_?id$/i.test(k) && !/^snapshot_ts$/i.test(k));
  },[data]);

  const totalPages = Math.ceil(data.length / PAGE);
  const slice = data.slice(page*PAGE, page*PAGE + PAGE);

  return (
    <div className="h-[270px] flex flex-col">
      <div className="overflow-auto grow">
        <table className="min-w-full text-xs">
          <thead className="sticky top-0 bg-background">
            <tr>{cols.map(c => <th key={c} className="px-2 py-1 text-left font-medium whitespace-nowrap">{c}</th>)}</tr>
          </thead>
          <tbody>
            {slice.map((r,i)=>(
              <tr key={i} className="border-t">
                {cols.map(c => <td key={c} className="px-2 py-1 whitespace-nowrap">
                  {typeof r[c]==='number' ? r[c].toFixed(2) : String(r[c])}
                </td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages>1 && (
        <div className="flex items-center justify-end gap-2 pt-1">
          <button className="px-2 py-0.5 border rounded disabled:opacity-40" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>Prev</button>
          <div className="text-[11px]">{page+1} / {totalPages}</div>
          <button className="px-2 py-0.5 border rounded disabled:opacity-40" onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1}>Next</button>
        </div>
      )}
    </div>
  );
}
