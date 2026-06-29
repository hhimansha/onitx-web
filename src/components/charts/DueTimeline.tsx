import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { TimelinePoint } from "@/types/dashboard";

const COLORS = ["#F85149", "#D29922", "#58A6FF"];

export function DueTimeline({ data }: { data: TimelinePoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tickColor = isDark ? "#9ca3af" : "#94a3b8";
  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const tooltipBg = isDark ? "#1c1c1c" : "#ffffff";
  const tooltipFg = isDark ? "#f1f5f9" : "#0f172a";

  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No upcoming due dates.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="label"
          type="category"
          width={110}
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            background: tooltipBg,
            color: tooltipFg,
            fontSize: 13,
          }}
          formatter={(v) => [v, "tasks"]}
          cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", radius: 8 }}
        />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={26}>
          {data.map((entry, i) => (
            <Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
