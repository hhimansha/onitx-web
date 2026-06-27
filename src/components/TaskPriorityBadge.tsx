import { Badge } from "@/components/ui/badge";
import type { TaskPriority } from "@/types";

const config: Record<TaskPriority, { label: string; variant: "secondary" | "warning" | "destructive" }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "destructive" },
};

const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
};

export default TaskPriorityBadge;
