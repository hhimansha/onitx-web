import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/utils/cn";
import type { Task, TaskStatus } from "@/types";
import TaskCard from "./TaskCard";

// ── Status config ─────────────────────────────────────────────────────────────

interface StatusMeta {
  label: string;
  dot: string;
}

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  OPEN:        { label: "Open",        dot: "bg-[#58A6FF]" },
  IN_PROGRESS: { label: "In Progress", dot: "bg-[#D29922]" },
  TESTING:     { label: "Testing",     dot: "bg-[#BC8CFF]" },
  DONE:        { label: "Done",        dot: "bg-[#3FB950]" },
};

// ── Column skeleton ───────────────────────────────────────────────────────────

export const KanbanColumnSkeleton = () => (
  <div className="flex min-w-[220px] flex-1 flex-col rounded-xl border bg-muted/30">
    <div className="flex items-center justify-between border-b px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-muted-foreground/30" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-5 w-6 animate-pulse rounded-full bg-muted" />
    </div>
    <div className="flex flex-col gap-2 p-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  </div>
);

// ── Column ────────────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
}

const KanbanColumn = ({ status, tasks, onDeleteTask }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const { label, dot } = STATUS_META[status];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-w-[220px] flex-1 flex-col rounded-xl border bg-muted/30 transition-colors duration-150",
        "h-[calc(100vh-260px)]",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot)} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Card list */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}

        {tasks.length === 0 && (
          <div
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border-2 border-dashed py-10",
              "text-xs text-muted-foreground transition-colors duration-150",
              isOver ? "border-primary/50 text-primary" : "border-muted-foreground/20"
            )}
          >
            {isOver ? "Drop here" : "No tasks"}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
