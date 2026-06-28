import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { getTask } from "@/services/taskService";
import type { Task } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import TaskPriorityBadge from "@/components/TaskPriorityBadge";
import CommentSection from "@/components/CommentSection";

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ── Small detail row used inside the Details card ─────────────────────────

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm text-right">{children}</span>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getTask(id)
      .then(setTask)
      .catch(() => setError("Task not found."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-48 animate-pulse rounded-md bg-muted" />
        <div className="h-48 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error ?? "Task not found."}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Navigation + actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tasks">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Tasks
          </Link>
        </Button>
        <Button asChild>
          <Link to={`/tasks/${task.id}/edit`}>
            <Pencil className="mr-1.5 h-4 w-4" />
            Edit Task
          </Link>
        </Button>
      </div>

      {/* Title + badges */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex flex-wrap gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            {task.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No description provided.</p>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow label="Status">
              <TaskStatusBadge status={task.status} />
            </DetailRow>
            <DetailRow label="Priority">
              <TaskPriorityBadge priority={task.priority} />
            </DetailRow>
            <DetailRow label="Due Date">
              {formatDate(task.dueDate)}
            </DetailRow>
            <DetailRow label="Created by">
              {task.createdBy?.name ?? "—"}
            </DetailRow>
            <DetailRow label="Assignees">
              {task.assignments && task.assignments.length > 0
                ? task.assignments.map((a) => a.user.name).join(", ")
                : "Unassigned"}
            </DetailRow>
            <DetailRow label="Created">
              {formatDate(task.createdAt)}
            </DetailRow>
          </CardContent>
        </Card>
      </div>

      <CommentSection taskId={task.id} />
    </div>
  );
};

export default TaskDetailPage;
