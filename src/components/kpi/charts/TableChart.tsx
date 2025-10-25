import React from 'react';
import { pretty } from '../utils';

export function TableChart({ rows }:{ rows: Array<Record<string, any>> }) {
  if (!rows || rows.length === 0) return <div className="text-[13px] text-slate-500">No data.</div>;
  const cols = Object.keys(rows[0]);
  return (
    <div className="max-h-[280px] overflow-auto rounded-md border border-slate-200">
      <table className="min-w-full text-[12px]">
        <thead className="sticky top-0 bg-slate-50 z-10">
          <tr>{cols.map(c => <th key={c} className="text-left px-2 py-2 font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-white' : 'bg-slate-50/50'}>
              {cols.map(c => <td key={c} className="px-2 py-1 tabular-nums font-mono">{pretty(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
