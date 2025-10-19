interface NumericChartProps {
  data: Record<string, any>[];
  yKey: string;
}

export function NumericChart({ data, yKey }: NumericChartProps) {
  const value = data[0]?.[yKey] || 0;

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="text-6xl font-bold text-primary mb-4">{value}</div>
      <div className="text-lg text-muted-foreground">Open Deferrals</div>
    </div>
  );
}
