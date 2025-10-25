import React from 'react';

export function SourceBadges({ sources = [] as string[] }) {
  if (!sources.length) return null;
  const tone = (s: string) =>
    s.includes('SAP')   ? 'bg-amber-100 text-amber-800 border-amber-200' :
    s.includes('AMOS')  ? 'bg-rose-100 text-rose-800 border-rose-200'   :
    s.includes('TRAX')  ? 'bg-sky-100 text-sky-800 border-sky-200'      :
    s.includes('Ramco') ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
    s.includes('AIMS')  ? 'bg-purple-100 text-purple-800 border-purple-200' :
    s.includes('Jeppesen') ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                          'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="flex items-center gap-1">
      {sources.map((s) => (
        <span key={s} className={`px-2 py-0.5 rounded-full text-[11px] border ${tone(s)}`}>
          {s}
        </span>
      ))}
    </div>
  );
}
