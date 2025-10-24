export function GaugeChart({ value, unit = '%' }:{ value:number; unit?: string; }) {
  const v = Number.isFinite(Number(value)) ? Number(value) : 0;
  const pct = Math.max(0, Math.min(100, v));
  return (
    <div className="flex flex-col items-center justify-center h-[270px]">
      <div className="relative w-40 h-20 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-8 border-muted"></div>
        <div className="absolute inset-0 rounded-t-full border-8 border-primary"
             style={{ clipPath: `polygon(0% 100%, 0% 0%, ${pct}% 0%, ${pct}% 100%)` }} />
      </div>
      <div className="text-xl font-semibold mt-2">{pct.toFixed(0)}{unit}</div>
    </div>
  );
}
