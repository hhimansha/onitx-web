import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { PriorityPoint } from "@/types/dashboard";

const COLOR: Record<PriorityPoint["priority"], string> = {
  HIGH: "#F85149",
  MEDIUM: "#D29922",
  LOW: "#58A6FF",
};

export function PriorityBar({ data }: { data: PriorityPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        No priority data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(v) => [v, "tasks"]} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
          {data.map((entry) => (
            <Cell key={entry.priority} fill={COLOR[entry.priority]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
