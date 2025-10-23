import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type Row = { ts?: string; bucket?: string; series?: string; value: number };

export function LineChart({ data, unit = '', xLabel, yLabel }: {
  data: Row[]; unit?: string; xLabel?: string; yLabel?: string;
}) {
  const seriesNames = Array.from(new Set(data.map(d => d.series ?? 'value')));
  const x = (r: Row) => r.bucket ?? r.ts ?? '';

  const byX = new Map<string, any>();
  data.forEach(r => {
    const key = x(r);
    if (!byX.has(key)) byX.set(key, { x: key });
    byX.get(key)[r.series ?? 'value'] = r.value;
  });
  const rows = Array.from(byX.values());

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RLineChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(v:any)=>`${v}${unit}`} />
        {seriesNames.length > 1 && <Legend />}
        {seriesNames.map((s) => (
          <Line key={s} type="monotone" dataKey={s} dot={false} strokeWidth={2} />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}
