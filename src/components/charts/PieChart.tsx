import { ResponsiveContainer, PieChart as RPieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

type Row = { category: string; value: number };
const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#84cc16','#e11d48'];

export function PieChart({ data, unit = '' }: { data: Row[]; unit?: string; }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RPieChart>
        <Tooltip formatter={(v:any, n:any)=>[`${v}${unit}`, n]} />
        <Legend />
        <Pie data={data} dataKey="value" nameKey="category" outerRadius={90}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
      </RPieChart>
    </ResponsiveContainer>
  );
}
