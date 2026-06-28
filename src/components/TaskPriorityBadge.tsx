import { Badge } from "@/components/ui/badge";
import type { TaskPriority } from "@/types";

const config: Record<TaskPriority, { label: string; variant: "secondary" | "warning" | "destructive" }> = {
  LOW: { label: "Low", variant: "secondary" },
  MEDIUM: { label: "Medium", variant: "warning" },
  HIGH: { label: "High", variant: "destructive" },
};

const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
};

export default TaskPriorityBadge;
