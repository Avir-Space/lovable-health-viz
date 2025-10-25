export type KpiRange = '1D'|'1W'|'2W'|'1M'|'6M'|'1Y';
export type KpiVariant = 'line'|'bar'|'pie'|'gauge'|'heatmap'|'table'|'numeric';

export type TimeseriesPoint = { ts?: string; bucket?: string; series?: string; value: number };
export type CategoryPoint  = { category: string; value: number };
export type HeatmapPoint   = { x: string; y: string; value: number };
export type TableRow       = Record<string, string|number|null>;

export type KpiMeta = {
  kpi_key: string;
  name: string;
  variant: KpiVariant;
  unit?: string | null;
  x_axis?: string | null;
  y_axis?: string | null;
  config?: any;
  dashboard?: string;
};

export type KpiPayloadRaw = {
  meta: KpiMeta;
  latest?: { value: number } | null;
  timeseries?: any[] | null;
  categories?: any[] | null;
  heatmap?: any[] | null;
  tableRows?: any[] | null;
  generated_at?: string;
};

export type KpiPayloadSafe = {
  meta: KpiMeta;
  generated_at?: string;
  latest?: { value: number } | null;
  timeseries?: TimeseriesPoint[];
  categories?: CategoryPoint[];
  heatmap?: HeatmapPoint[];
  tableRows?: TableRow[];
};
