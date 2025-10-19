import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface HeatmapChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
}

export function HeatmapChart({ data, xKey, yKey, xLabel, yLabel }: HeatmapChartProps) {
  // Filter out metadata rows
  const filteredData = data.filter(item => 
    typeof item[yKey] === 'number' && 
    !['KPI Variant', 'Variant Detail', 'Reason to Track'].includes(String(item[xKey]))
  );
  
  const maxValue = Math.max(...filteredData.map((d) => d[yKey]));

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.7) return "hsl(var(--destructive))";
    if (intensity > 0.3) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            formatter={(value: number) => [value.toFixed(2), yLabel]}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey={yKey} radius={[8, 8, 0, 0]}>
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry[yKey])} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
