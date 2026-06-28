import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { DayPoint } from "@/types/dashboard";

export function CreationTrend({ data }: { data: DayPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        No activity in the last 7 days.
      </div>
    );
  }

  const formatted = data.map((d) => ({
    count: d.count,
    // Parse as noon local time to avoid UTC-midnight timezone shift
    day: new Date(d.date + "T12:00:00").toLocaleDateString("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#58A6FF" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#58A6FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(v) => [v, "tasks created"]} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#58A6FF"
          strokeWidth={2}
          fill="url(#trendFill)"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
