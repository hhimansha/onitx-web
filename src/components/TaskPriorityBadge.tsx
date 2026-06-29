import { cn } from "@/utils/cn";
import type { TaskPriority } from "@/types";

export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  HIGH:   "bg-red-100   text-red-700   dark:bg-red-900/40   dark:text-red-400",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  LOW:    "bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-400",
};

const LABELS: Record<TaskPriority, string> = {
  HIGH: "High", MEDIUM: "Medium", LOW: "Low",
};

const TaskPriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <span className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
    PRIORITY_STYLES[priority]
  )}>
    {LABELS[priority]}
  </span>
);

export default TaskPriorityBadge;
