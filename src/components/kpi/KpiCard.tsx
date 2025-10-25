import React, { useMemo, useState } from 'react';
import { SourceBadges } from './SourceBadges';
import { HoverActions } from './HoverActions';
import { AiActionBar } from './AiActionBar';
import { AiActionSlideover } from './AiActionSlideover';
import { deriveSourcesFromKey, RangeTag } from './utils';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { GaugeChart } from './charts/GaugeChart';
import { HeatmapChart } from './charts/HeatmapChart';
import { TableChart } from './charts/TableChart';
import { useKpiData } from '@/hooks/useKpiData';

export function KpiCard({ kpiKey, title, variant, unit }:{
  kpiKey: string;
  title: string;
  variant: 'line'|'bar'|'pie'|'gauge'|'heatmap'|'table';
  unit?: string;
}) {
  const [range, setRange] = useState<RangeTag>('1M');
  const [aiOpen, setAiOpen] = useState(false);
  const { payload, isLoading, refresh } = useKpiData(kpiKey, variant as any, range as any);

  const sources = useMemo(
    () => payload?.meta?.config?.sources || deriveSourcesFromKey(kpiKey),
    [payload, kpiKey]
  );

  const syncedLabel = useMemo(() => {
    const ts = payload?.generated_at ? new Date(payload.generated_at) : null;
    if (!ts) return '';
    const diff = Math.max(1, Math.round((Date.now() - ts.getTime()) / 1000));
    return `Synced ${diff < 60 ? diff + 's' : Math.round(diff/60) + 'm'} ago`;
  }, [payload?.generated_at]);

  const RangeChip = ({ tag }:{ tag: RangeTag }) => (
    <button
      onClick={() => setRange(tag)}
      className={`px-2 py-1 rounded-md border text-[12px] ${range === tag ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
    >{tag}</button>
  );

  const content = useMemo(() => {
    if (!payload) return null;
    const u = unit || payload?.meta?.unit;
    switch (variant) {
      case 'line':    return <LineChart data={payload.timeseries || []} unit={u} range={range} />;
      case 'bar':     return <BarChart  data={payload.categories || []} unit={u} />;
      case 'pie':     return <PieChart  data={payload.categories || []} unit={u} />;
      case 'gauge':   return <GaugeChart value={Number(payload.latest ?? 0)} unit={u} />;
      case 'heatmap': return <HeatmapChart data={payload.heatmap || []} />;
      case 'table':   return <TableChart rows={payload.tableRows || []} />;
      default:        return null;
    }
  }, [payload, variant, range, unit]);

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <h3 className="text-[15px] font-semibold leading-5 truncate" title={title}>{title}</h3>
          <SourceBadges sources={sources} />
        </div>
        <div className="flex items-center gap-2">
          {(['1D','1W','2W','1M','6M','1Y'] as RangeTag[]).map(t => <RangeChip key={t} tag={t} />)}
          <button onClick={()=>refresh()}
            className="ml-2 px-2 py-1 rounded-md border text-[12px] bg-white border-slate-200 hover:bg-slate-50">
            {isLoading
              ? <span className="inline-block w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              : 'Sync'}
          </button>
        </div>
      </div>

      {/* Hover toolstrip */}
      <HoverActions
        onCopy={()=>{ try { navigator.clipboard.writeText(JSON.stringify(payload ?? {}, null, 2)); } catch{} }}
        onBookmark={()=>{}}
        onPin={()=>{}}
        onMore={()=>{}}
      />

      {/* Visualization */}
      <div className="mt-2">{content}</div>

      {/* Footer */}
      <div className="mt-2 text-[12px] text-slate-500">{syncedLabel}</div>

      {/* AI Action */}
      <AiActionBar onGenerate={()=>setAiOpen(true)} />
      <AiActionSlideover open={aiOpen} onClose={()=>setAiOpen(false)} title={title} payload={payload} />
    </div>
  );
}
