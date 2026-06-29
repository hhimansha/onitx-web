import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { StatusPoint } from "@/types/dashboard";

const COLOR: Record<StatusPoint["status"], string> = {
  OPEN:        "#58A6FF",
  IN_PROGRESS: "#D29922",
  TESTING:     "#BC8CFF",
  DONE:        "#3FB950",
};

export function StatusDonut({ data }: { data: StatusPoint[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No task data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={68}
          outerRadius={104}
          paddingAngle={4}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLOR[entry.status]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
            background: isDark ? "#1c1c1c" : "#ffffff",
            color: isDark ? "#f1f5f9" : "#0f172a",
            fontSize: 13,
          }}
          formatter={(v) => [v, "tasks"]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: isDark ? "#9ca3af" : "#6b7280" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
