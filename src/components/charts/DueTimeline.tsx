import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import type { TimelinePoint } from "@/types/dashboard";

const COLORS = ["#F85149", "#D29922", "#58A6FF"];

export function DueTimeline({ data }: { data: TimelinePoint[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
        No upcoming due dates.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="label" type="category" width={110} />
        <Tooltip formatter={(v) => [v, "tasks"]} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((entry, i) => (
            <Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
