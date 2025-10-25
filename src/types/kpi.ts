export type KpiRange = '1D' | '1W' | '2W' | '1M' | '6M' | '1Y';

export interface KpiMeta {
  kpi_key: string;
  dashboard: string;
  name: string;
  variant: 'line' | 'bar' | 'pie' | 'gauge' | 'heatmap' | 'table' | 'numeric' | 'dualAxis';
  x_axis?: string | null;
  y_axis?: string | null;
  unit?: string | null;
  config?: {
    dualAxis?: {
      seriesMap: Record<string, 0 | 1>;
      rightAxisName?: string;
      rightAxisUnit?: string;
    };
    [key: string]: any;
  } | null;
}

export interface KpiDatum {
  ts?: string;
  bucket?: string;
  series?: string | null;
  category?: string | null;
  x?: string;
  y?: string;
  value: number;
}

export interface KpiPayload {
  meta: KpiMeta;
  timeseries?: KpiDatum[];
  categories?: KpiDatum[];
  tableRows?: any[];
  heatmap?: KpiDatum[];
  latest?: KpiDatum | null;
  generated_at?: string;
}
