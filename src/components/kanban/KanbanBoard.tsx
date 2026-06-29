import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensors,
  useSensor,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
  type DragEndEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/types";
import KanbanColumn, { KanbanColumnSkeleton } from "./KanbanColumn";
import TaskCard from "./TaskCard";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUSES: TaskStatus[] = ["OPEN", "IN_PROGRESS", "TESTING", "DONE"];

const dropAnimation: DropAnimation = {
  duration: 200,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.3" } },
  }),
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface KanbanBoardProps {
  tasks: Task[];
  loading?: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask?: (taskId: string) => void;
}

// ── Board ─────────────────────────────────────────────────────────────────────

const KanbanBoard = ({ tasks, loading, onStatusChange, onDeleteTask }: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const map: Record<TaskStatus, Task[]> = {
      OPEN: [], IN_PROGRESS: [], TESTING: [], DONE: [],
    };
    for (const task of tasks) {
      if (task.status in map) map[task.status].push(task);
    }
    return map;
  }, [tasks]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const newStatus = over.id as TaskStatus;
    if (!STATUSES.includes(newStatus)) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task || task.status === newStatus) return;

    onStatusChange(task.id, newStatus);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((s) => <KanbanColumnSkeleton key={s} />)}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="rotate-1 scale-[1.03]">
            <TaskCard task={activeTask} isOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
