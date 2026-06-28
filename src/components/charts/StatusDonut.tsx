import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { StatusPoint } from "@/types/dashboard";

const COLOR: Record<StatusPoint["status"], string> = {
  OPEN: "#58A6FF",
  IN_PROGRESS: "#D29922",
  TESTING: "#BC8CFF",
  DONE: "#3FB950",
};

export function StatusDonut({ data }: { data: StatusPoint[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No task data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={72}
          outerRadius={110}
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLOR[entry.status]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [v, "tasks"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
