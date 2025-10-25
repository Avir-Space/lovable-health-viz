import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { KpiPayload, KpiRange } from '@/types/kpi';
import { useKpiData } from '@/hooks/useKpiData';

import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import GaugeChart from '@/components/charts/GaugeChart';
import HeatmapChart from '@/components/charts/HeatmapChart';
import NumericChart from '@/components/charts/NumericChart';
import TableChart from '@/components/charts/TableChart';
import DualAxisLine from '@/components/charts/DualAxisLine';

const RANGES: KpiRange[] = ['1D','1W','2W','1M','6M','1Y'];
const TS_VARIANTS = new Set(['line','dualAxis']);

function Header({ title, synced }: { title: string; synced?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="font-semibold truncate">{title}</div>
      <div className="text-xs text-muted-foreground">{synced || 'Not synced'}</div>
    </div>
  );
}

export function KpiCardBackendDriven({ kpiKey, defaultRange = '1M', useLiveData = true }: { kpiKey: string; defaultRange?: KpiRange; useLiveData?: boolean; }) {
  const [range, setRange] = useState<KpiRange>(defaultRange);
  const { payload, isLoading, isValidating, error, refresh } = useKpiData(kpiKey, range, useLiveData);

  const { meta, timeseries = [], categories = [], heatmap = [], tableRows = [], latest } = payload || ({} as KpiPayload);
  const isTimeseries = meta?.variant && TS_VARIANTS.has(meta.variant);

  const synced = payload?.generated_at ? `Synced just now` : 'Not synced';

  const sources = useMemo(() => {
    const key = kpiKey.toLowerCase();
    if (key.includes('aog') || key.includes('airworthiness')) return ['AMOS','TRAX'];
    if (key.includes('spare') || key.includes('inventory')) return ['SAP','Ramco','AMOS'];
    if (key.includes('work_order') || key.includes('work_packages')) return ['AMOS','SAP'];
    if (key.includes('tech_delay') || key.includes('deferral') || key.includes('mel')) return ['AMOS','TRAX'];
    return ['AMOS'];
  }, [kpiKey]);

  const renderChart = () => {
    if (isLoading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
    if (error) return <div className="p-10 text-sm text-red-600">Failed to load</div>;
    if (!payload) return <div className="p-10 text-sm text-muted-foreground">No data</div>;

    switch (meta.variant) {
      case 'line':
        return <LineChart data={timeseries} unit={meta.unit || ''} xLabel={meta.x_axis || ''} yLabel={meta.y_axis || ''} />;
      case 'dualAxis':
        return (
          <DualAxisLine
            data={timeseries}
            seriesMap={meta.config?.dualAxis?.seriesMap || { value: 0 }}
            leftName={meta.y_axis || ''}
            rightName={meta.config?.dualAxis?.rightAxisName || ''}
            leftUnit={meta.unit || ''}
            rightUnit={meta.config?.dualAxis?.rightAxisUnit || ''}
            xLabel={meta.x_axis || ''}
          />
        );
      case 'bar':
        return <BarChart data={categories.map(c => ({ category: c.category || '', value: c.value }))} unit={meta.unit || ''} xLabel={meta.x_axis || ''} yLabel={meta.y_axis || ''} />;
      case 'pie':
        return <PieChart data={categories.map(c => ({ category: c.category || '', value: c.value }))} unit={meta.unit || ''} />;
      case 'gauge':
        return <GaugeChart value={latest?.value ?? 0} unit={meta.unit || '%'} />;
      case 'heatmap':
        return <HeatmapChart data={heatmap.map(h => ({ x: h.x || h.category || '', y: h.y || h.series || '', value: h.value }))} xLabel={meta.x_axis || ''} yLabel={meta.y_axis || ''} />;
      case 'table':
        return <TableChart rows={tableRows || []} />;
      case 'numeric':
      default:
        return <NumericChart value={latest?.value ?? 0} unit={meta.unit || ''} label={meta.name} />;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <Header title={meta?.name || kpiKey} synced={synced} />
      {isTimeseries ? (
        <div className="flex flex-wrap gap-2">
          {RANGES.map(r => (
            <Button key={r} size="sm" variant={r === range ? 'default' : 'outline'} onClick={() => setRange(r)}>{r}</Button>
          ))}
          <Button size="sm" variant="secondary" onClick={() => refresh()}>
            {isValidating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            Sync now
          </Button>
        </div>
      ) : null}

      <div className="min-h-[240px]">{renderChart()}</div>

      <div className="flex items-center gap-2 pt-2">
        {sources.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
      </div>
    </Card>
  );
}
