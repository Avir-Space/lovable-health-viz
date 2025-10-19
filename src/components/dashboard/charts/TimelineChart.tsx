import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimelineChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
}

export function TimelineChart({ data, xKey, yKey, xLabel, yLabel }: TimelineChartProps) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            formatter={(value: number) => [value, yLabel]}
            labelFormatter={(label: string) => `${xLabel}: ${label}`}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey={yKey} fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
