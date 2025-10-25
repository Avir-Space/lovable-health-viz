import React, { useMemo } from 'react';
import { X } from 'lucide-react';

export function AiActionSlideover({ open, onClose, title, payload }:
  { open:boolean; onClose:()=>void; title:string; payload:any; }) {

  const insight = useMemo(() => {
    const ts = payload?.timeseries || [];
    const first = ts[0]?.value ?? 0;
    const last  = ts[ts.length - 1]?.value ?? (payload?.latest ?? 0);
    const trend = Math.sign((last ?? 0) - (first ?? 0));
    return {
      headline: trend > 0 ? 'Upward trend detected'
               : trend < 0 ? 'Downward trend detected'
               : 'Stable metric',
      bullets: [
        `Current: ${last}${payload?.meta?.unit || ''}`,
        `Data points: ${ts.length}`,
        `Dashboard: ${payload?.meta?.dashboard || 'Unknown'}`
      ],
      recommendation: 'Create pre-emptive work order to mitigate risk based on recent trend and anomaly windows.'
    };
  }, [payload]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100':'opacity-0'}`} onClick={onClose}/>
      <aside className={`absolute top-0 right-0 h-full w-[420px] bg-neutral-950 text-white shadow-xl
                         transition-transform ${open ? 'translate-x-0':'translate-x-full'}`}>
        <div className="p-5 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 space-y-4 text-[14px]">
          <p className="opacity-80">Hydraulic System Predictive Degradation Detected — Tail A6-EOL (demo)</p>
          <ul className="list-disc pl-5 space-y-2">
            {insight.bullets.map((b:string,i:number)=>(<li key={i}>{b}</li>))}
          </ul>
          <div className="mt-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
            ⚠ High probability of unscheduled removal within 72 hours if not replaced.
          </div>
          <button className="mt-6 w-full py-2 rounded-md bg-emerald-500 text-white font-medium">
            Create Pre-Emptive Work Order
          </button>
          <button className="mt-2 w-full py-2 rounded-md bg-neutral-800 text-white" onClick={onClose}>Cancel</button>
        </div>
      </aside>
    </div>
  );
}
