export function NumericChart({ value, unit = '', label }:{ value:number; unit?:string; label?:string; }) {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] gap-1">
      <div className="text-3xl font-semibold">{Number(value ?? 0).toFixed(2)}{unit}</div>
      {label && <div className="text-xs text-muted-foreground">{label}</div>}
    </div>
  );
}
