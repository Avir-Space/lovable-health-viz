export default function NumericChart({ value, unit = '', label }: { value: number; unit?: string; label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[220px]">
      <div className="text-4xl font-bold">{Number.isFinite(value) ? value.toFixed(2) : '--'}{unit}</div>
      {label ? <div className="text-xs text-muted-foreground mt-2">{label}</div> : null}
    </div>
  );
}
