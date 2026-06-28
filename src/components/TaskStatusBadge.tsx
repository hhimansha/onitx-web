import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types";

const config: Record<TaskStatus, { label: string; variant: "secondary" | "info" | "warning" | "success" }> = {
  OPEN: { label: "Open", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  TESTING: { label: "Testing", variant: "warning" },
  DONE: { label: "Done", variant: "success" },
};

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
};

export default TaskStatusBadge;
