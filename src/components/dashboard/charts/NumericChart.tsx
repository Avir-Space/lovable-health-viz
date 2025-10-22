interface NumericChartProps {
  value: number;
  unit?: string;
  label?: string;
}

export function NumericChart({ value, unit = "", label }: NumericChartProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="text-4xl font-bold tabular-nums">
        {Number.isFinite(value) ? value.toFixed(2) : '—'}{unit}
      </div>
      {label && <div className="text-sm text-muted-foreground mt-1">{label}</div>}
    </div>
  );
}
