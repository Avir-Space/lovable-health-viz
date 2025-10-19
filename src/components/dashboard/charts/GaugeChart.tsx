import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface GaugeChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
}

export function GaugeChart({ data, xKey, yKey }: GaugeChartProps) {
  const value = data.find((d) => d[xKey] === "Airworthy")?.[yKey] || 0;
  const remaining = 100 - value;

  const chartData = [
    { name: "Value", value: value, color: "hsl(var(--chart-3))" },
    { name: "Remaining", value: remaining, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-16">
        <div className="text-4xl font-bold text-primary">{value}%</div>
        <div className="text-sm text-muted-foreground mt-1">Airworthy</div>
      </div>
    </div>
  );
}
