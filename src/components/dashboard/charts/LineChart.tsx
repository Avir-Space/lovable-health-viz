import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  additionalKeys?: string[];
}

export function LineChart({ data, xKey, yKey, xLabel, yLabel, additionalKeys = [] }: LineChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey={xKey}
            label={{ value: xLabel, position: "insideBottom", offset: -5 }}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          {additionalKeys.length > 0 && <Legend />}
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
            activeDot={{ r: 6 }}
          />
          {additionalKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(var(--chart-${(idx % 5) + 2}))`}
              strokeWidth={2}
              dot={{ fill: `hsl(var(--chart-${(idx % 5) + 2}))`, r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
