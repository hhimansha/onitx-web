import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { Calendar, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Task } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PRIORITY_STYLES } from "@/components/TaskPriorityBadge";

const CARD_BG: Record<Task["priority"], string> = {
  HIGH:   "bg-red-50/80   dark:bg-red-950/20",
  MEDIUM: "bg-amber-50/80 dark:bg-amber-950/20",
  LOW:    "bg-blue-50/80  dark:bg-blue-950/20",
};

const CARD_BORDER_L: Record<Task["priority"], string> = {
  HIGH:   "border-l-red-500",
  MEDIUM: "border-l-amber-500",
  LOW:    "border-l-blue-500",
};

const formatDate = (dateStr: string) => {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const d = isDateOnly ? new Date(dateStr + "T12:00:00") : new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getInitials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ── Props ─────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDelete?: (taskId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const TaskCard = ({ task, isOverlay = false, onDelete }: TaskCardProps) => {
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  });

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate + "T23:59:59") < new Date();

  const visibleAssignees = task.assignments?.slice(0, 3) ?? [];
  const overflow = Math.max(0, (task.assignments?.length ?? 0) - 3);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "group select-none rounded-lg border border-l-4 p-3 shadow-sm",
        CARD_BG[task.priority],
        CARD_BORDER_L[task.priority],
        "transition-shadow duration-150 hover:shadow-md",
        "cursor-grab active:cursor-grabbing",
        isDragging && !isOverlay && "opacity-30 shadow-none",
        isOverlay && "cursor-grabbing shadow-2xl ring-1 ring-primary/20"
      )}
    >
      {/* Top row: priority badge + options menu */}
      <div className="mb-2 flex items-start justify-between gap-1">
        <span
          className={cn(
            "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            PRIORITY_STYLES[task.priority]
          )}
        >
          {task.priority}
        </span>

        {/* 3-dot options — stop pointer events from triggering drag */}
        {onDelete && !isOverlay && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded text-muted-foreground",
                    "opacity-0 transition-opacity group-hover:opacity-100",
                    "hover:bg-accent hover:text-foreground focus:opacity-100 focus:outline-none"
                  )}
                  aria-label="Task options"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Title */}
      <p
        role="button"
        tabIndex={0}
        onClick={handleTitleClick}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/tasks/${task.id}`)}
        className="mb-3 line-clamp-2 cursor-pointer text-sm font-medium leading-snug transition-colors hover:text-primary"
      >
        {task.title}
      </p>

      {/* Footer: due date + assignees */}
      <div className="flex items-center justify-between gap-2">
        {task.dueDate ? (
          <span
            className={cn(
              "flex items-center gap-1 text-[11px]",
              isOverdue
                ? "font-medium text-destructive"
                : "text-muted-foreground"
            )}
          >
            <Calendar className="h-3 w-3 shrink-0" />
            {formatDate(task.dueDate)}
          </span>
        ) : (
          <span />
        )}

        {/* Assignee avatars */}
        {visibleAssignees.length > 0 && (
          <div className="flex shrink-0 -space-x-1.5">
            {visibleAssignees.map((a) => (
              <Avatar key={a.user.id} className="h-5 w-5 ring-1 ring-background" title={a.user.name}>
                <AvatarImage src={a.user.profileImage ?? undefined} alt={a.user.name} />
                <AvatarFallback className="text-[9px] font-semibold">
                  {getInitials(a.user.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-medium ring-1 ring-background">
                +{overflow}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
