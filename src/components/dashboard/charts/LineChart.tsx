import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";

interface LineChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  additionalKeys?: string[];
  secondYAxis?: boolean;
  secondYAxisLabel?: string;
}

export function LineChart({ 
  data, 
  xKey, 
  yKey, 
  xLabel, 
  yLabel, 
  additionalKeys = [],
  secondYAxis = false,
  secondYAxisLabel
}: LineChartProps) {
  // Check if we need dual Y-axis (for AOG Events chart)
  const hasDualAxis = secondYAxis && additionalKeys.length > 0;
  
  if (hasDualAxis) {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 50, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xKey}
              label={{ value: xLabel, position: "insideBottom", offset: -5 }}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: yLabel, angle: -90, position: "insideLeft" }}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: secondYAxisLabel || additionalKeys[0], angle: 90, position: "insideRight" }}
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
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={yKey}
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Bar
              yAxisId="right"
              dataKey={additionalKeys[additionalKeys.length - 1]}
              fill="hsl(var(--chart-2))"
              opacity={0.6}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

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
              stroke={`hsl(var(--chart-${(idx % 5) + 2})}`}
              strokeWidth={2}
              dot={{ fill: `hsl(var(--chart-${(idx % 5) + 2}))`, r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
