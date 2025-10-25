import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { KpiRange, KpiVariant, useKpiData } from '@/hooks/useKpiData';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { RangeChips } from './ui/range-chips';
import { Alert, AlertDescription } from './ui/alert';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import GaugeChart from './charts/GaugeChart';
import Heatmap from './charts/HeatmapChart';
import TableGrid from './TableGrid';

const TIME_SERIES: KpiVariant[] = ['line', 'numeric', 'gauge'];

export default function KpiCardBackendDriven({
  kpi_key,
  name,
  variant,
  unit,
  defaultRange = '1M',
  useLiveData = true,
  dashboard,
}: {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  unit?: string | null;
  defaultRange?: KpiRange;
  useLiveData?: boolean;
  dashboard?: string;
}) {
  const [range, setRange] = useState<KpiRange>(defaultRange);
  const { payload, isLoading, error, refresh } = useKpiData(
    kpi_key,
    variant,
    range,
    useLiveData
  );
  const showRanges = TIME_SERIES.includes(variant);

  const body = useMemo(() => {
    if (!payload)
      return (
        <div className="text-[12px] text-muted-foreground">No data.</div>
      );
    const p = payload;

    switch (variant) {
      case 'line':
        return (
          <LineChart
            data={p.timeseries || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={p.categories || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'pie':
        return (
          <PieChart
            data={p.categories || []}
            unit={p.meta.unit || ''}
            dashboard={dashboard}
          />
        );
      case 'gauge': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        const maxVal = p.meta.unit === '%' ? 100 : Math.ceil((Number(v) || 0) * 1.2);
        return (
          <GaugeChart
            value={Number(v) || 0}
            unit={p.meta.unit || '%'}
            max={maxVal}
          />
        );
      }
      case 'heatmap':
        return <Heatmap data={p.heatmap || []} />;
      case 'table':
        return <TableGrid rows={p.tableRows || []} />;
      case 'numeric': {
        const v = p.latest?.value ?? (p.timeseries?.at(-1)?.value ?? 0);
        return (
          <div className="text-3xl font-semibold">
            {(Number(v) || 0).toLocaleString()}
            {p.meta.unit || ''}
          </div>
        );
      }
      default:
        return <div className="text-xs">Unsupported variant</div>;
    }
  }, [payload, variant, dashboard]);

  return (
    <Card className="p-5 hover:shadow-md transition-all hover:scale-[1.01] h-[380px] flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-semibold leading-5 tracking-tight truncate" title={name}>
            {name}
          </h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showRanges && (
            <RangeChips selected={range} onChange={setRange} />
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => refresh()}
            className="h-7 px-2 text-[11px]"
            aria-label="Refresh data"
          >
            Sync
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            <span className="text-[12px] text-muted-foreground">Loading…</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="text-[12px]">
            <AlertDescription>
              Failed to load. Will retry in 5s.
            </AlertDescription>
          </Alert>
        ) : (
          body
        )}
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground flex justify-between items-center">
        <span>
          {payload?.generated_at
            ? `Synced ${formatDistanceToNow(new Date(payload.generated_at), { addSuffix: true })}`
            : 'Not synced'}
        </span>
        {payload?.meta?.unit && (
          <span className="text-right">Unit: {payload.meta.unit}</span>
        )}
      </div>
    </Card>
  );
}
