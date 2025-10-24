export function HeatmapChart({ data, xLabel = 'X', yLabel = 'Y' }:{ data: {x:string;y:string;value:number}[]; xLabel?: string; yLabel?: string; }) {
  const xs = Array.from(new Set(data.map(d=>d.x)));
  const ys = Array.from(new Set(data.map(d=>d.y)));
  const byXY = new Map<string, number>();
  data.forEach(d => byXY.set(`${d.x}__${d.y}`, d.value));
  const vals = data.map(d=>d.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  
  const color = (v:number) => {
    const t = max === min ? 0 : (v - min) / (max - min);
    const r = Math.round(224 - 120*t), g = Math.round(247 - 180*t), b = Math.round(250 - 220*t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className="w-full">
      <div className="text-xs mb-1">{xLabel}</div>
      <div className="grid" style={{ gridTemplateColumns: `80px repeat(${xs.length}, 1fr)` }}>
        <div></div>
        {xs.map(x => <div key={x} className="text-xs text-center">{x}</div>)}
        {ys.map(y => (
          <div key={y} className="contents">
            <div className="text-xs">{y}</div>
            {xs.map(x => {
              const v = byXY.get(`${x}__${y}`) ?? 0;
              return (
                <div key={`${x}-${y}`} className="h-7 flex items-center justify-center text-[11px] border"
                     title={`${x} × ${y}: ${v}`} style={{ background: color(v) }}>{v}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
