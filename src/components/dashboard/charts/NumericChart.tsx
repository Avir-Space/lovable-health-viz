interface NumericChartProps {
  value: number;
  unit?: string;
  label?: string;
}

export function NumericChart({ value, unit = "", label }: NumericChartProps) {
  const displayValue = Number.isFinite(value) && value !== 0 ? value.toFixed(2) : '—';
  
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: 300 }}>
      <div className="text-4xl font-bold tabular-nums">
        {displayValue}{displayValue !== '—' ? unit : ''}
      </div>
      {label && <div className="text-sm text-muted-foreground mt-1">{label}</div>}
    </div>
  );
}
