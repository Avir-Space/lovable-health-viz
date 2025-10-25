import { useState, useMemo } from 'react';
import { KpiRange, KpiVariant, useKpiData } from '@/hooks/useKpiData';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import GaugeChart from './charts/GaugeChart';
import Heatmap from './charts/HeatmapChart';
import TableGrid from './TableGrid';

const TIME_SERIES: KpiVariant[] = ['line','numeric','gauge'];

export default function KpiCardBackendDriven({
  kpi_key, name, variant, unit, defaultRange = '1M', useLiveData = true,
}: {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  unit?: string | null;
  defaultRange?: KpiRange;
  useLiveData?: boolean;
}) {
  const [range, setRange] = useState<KpiRange>(defaultRange);
  const { payload, isLoading, error, refresh } = useKpiData(kpi_key, variant, range, useLiveData);
  const showRanges = TIME_SERIES.includes(variant);

  const body = useMemo(() => {
    if (!payload) return <div className="text-sm">No data.</div>;
    const p = payload;

    switch (variant) {
      case 'line':
        return <LineChart data={p.timeseries || []} unit={p.meta.unit || ''} />;
      case 'bar':
        return <BarChart data={p.categories || []} unit={p.meta.unit || ''} />;
      case 'pie':
        return <PieChart data={p.categories || []} unit={p.meta.unit || ''} />;
      case 'gauge': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        return <GaugeChart value={Number(v) || 0} unit={p.meta.unit || '%'} />;
      }
      case 'heatmap':
        return <Heatmap data={p.heatmap || []} />;
      case 'table':
        return <TableGrid rows={p.tableRows || []} />;
      case 'numeric': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        return <div className="text-3xl font-semibold">{(Number(v) || 0).toLocaleString()}{p.meta.unit || ''}</div>;
      }
      default:
        return <div>Unsupported variant</div>;
    }
  }, [payload, variant]);

  return (
    <div className="bg-white rounded-xl border p-3 flex flex-col gap-2" style={{ minHeight: 260, overflow: 'hidden' }}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium truncate pr-2">{name}</div>
        <div className="flex items-center gap-2">
          {showRanges && (
            <div className="flex items-center gap-1">
              {(['1D','1W','2W','1M','6M','1Y'] as KpiRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2 py-[3px] rounded text-xs border transition ${range===r?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700'}`}
                >{r}</button>
              ))}
            </div>
          )}
          <button onClick={() => refresh()} className="text-xs px-2 py-1 border rounded">Sync</button>
        </div>
      </div>

      <div className="flex-1 min-h-[170px]">
        {error && <div className="text-xs text-red-600 mb-2">Failed to load data.</div>}
        {isLoading ? <div className="text-xs text-muted-foreground">Loading…</div> : body}
      </div>

      <div className="text-[10px] text-muted-foreground">
        {payload?.generated_at ? `Synced ${new Date(payload.generated_at).toLocaleString()}` : 'Not synced'}
      </div>
    </div>
  );
}
