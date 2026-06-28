import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Assignee } from "@/types/dashboard";

export function TopAssignees({ data }: { data: Assignee[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        No assignment data yet.
      </div>
    );
  }

  const chartData = data.map((u) => ({ name: u.name, tasks: u.taskCount }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <XAxis type="number" allowDecimals={false} />
        <YAxis dataKey="name" type="category" width={110} />
        <Tooltip formatter={(v) => [v, "tasks assigned"]} />
        <Bar dataKey="tasks" fill="#BC8CFF" radius={[0, 4, 4, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
