interface NumericChartProps {
  data: Record<string, any>[];
  yKey: string;
}

export function NumericChart({ data, yKey }: NumericChartProps) {
  // Find the actual value row (skip metadata rows)
  const valueRow = data.find(row => typeof row[yKey] === 'number');
  const value = valueRow?.[yKey] || 0;

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="text-6xl font-bold text-primary mb-4">{value}</div>
      <div className="text-lg text-muted-foreground">Open Deferrals</div>
    </div>
  );
}
