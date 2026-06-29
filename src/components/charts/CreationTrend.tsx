import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { DayPoint } from "@/types/dashboard";

export function CreationTrend({ data }: { data: DayPoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stroke     = isDark ? "#818cf8" : "#1b17ff";
  const tickColor  = isDark ? "#9ca3af" : "#94a3b8";
  const gridColor  = isDark ? "#27272a" : "#f1f5f9";
  const tooltipBg  = isDark ? "#1c1c1c" : "#ffffff";
  const tooltipFg  = isDark ? "#f1f5f9" : "#0f172a";

  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        No activity in the last 7 days.
      </div>
    );
  }

  const formatted = data.map((d) => ({
    count: d.count,
    day: new Date(d.date + "T12:00:00").toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={formatted} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={stroke} stopOpacity={0.2} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="day"
          tick={{ fill: tickColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
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
          formatter={(v) => [v, "tasks created"]}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={stroke}
          strokeWidth={2.5}
          fill="url(#trendFill)"
          dot={{ r: 4, fill: stroke, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: stroke, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
