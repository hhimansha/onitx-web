import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { PriorityPoint } from "@/types/dashboard";

const COLOR: Record<PriorityPoint["priority"], string> = {
  HIGH:   "#F85149",
  MEDIUM: "#D29922",
  LOW:    "#58A6FF",
};

export function PriorityBar({ data }: { data: PriorityPoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tickColor  = isDark ? "#9ca3af" : "#94a3b8";
  const gridColor  = isDark ? "#27272a" : "#f1f5f9";
  const tooltipBg  = isDark ? "#1c1c1c" : "#ffffff";
  const tooltipFg  = isDark ? "#f1f5f9" : "#0f172a";

  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        No priority data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
        <XAxis dataKey="label" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
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
        <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
          {data.map((entry) => (
            <Cell key={entry.priority} fill={COLOR[entry.priority]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
