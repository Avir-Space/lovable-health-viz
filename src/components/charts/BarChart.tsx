import { ResponsiveContainer, BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type Row = { category: string; value: number };

export function BarChart({ data, unit = '', xLabel, yLabel }: {
  data: Row[]; unit?: string; xLabel?: string; yLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(v:any)=>`${v}${unit}`} />
        <Bar dataKey="value" />
      </RBarChart>
    </ResponsiveContainer>
  );
}
