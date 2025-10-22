interface NumericChartProps {
  value: number;
  unit?: string;
  label?: string;
}

export function NumericChart({ value, unit = "", label }: NumericChartProps) {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center">
      <div className="text-6xl font-bold tabular-nums text-primary mb-2">
        {value.toFixed(2)}{unit}
      </div>
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
    </div>
  );
}
