import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types";

const config: Record<TaskStatus, { label: string; variant: "secondary" | "info" | "success" }> = {
  todo: { label: "Open", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "info" },
  done: { label: "Done", variant: "success" },
};

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export default TaskStatusBadge;
