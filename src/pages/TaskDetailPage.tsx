import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { getTask, updateTask } from "@/services/taskService";
import { getUserOptions, type UserOption } from "@/services/userService";
import type { Task, TaskStatus, TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import AssigneeMultiSelect from "@/components/AssigneeMultiSelect";
import DatePicker from "@/components/ui/DatePicker";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import TaskPriorityBadge from "@/components/TaskPriorityBadge";
import CommentSection from "@/components/CommentSection";

// ── Helpers ───────────────────────────────────────────────────────────────────

const toDateInput = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
};

// ── Form schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  title:          z.string().min(1, "Title is required").max(100),
  description:    z.string().optional(),
  priority:       z.enum(["LOW", "MEDIUM", "HIGH"]),
  status:         z.enum(["OPEN", "IN_PROGRESS", "TESTING", "DONE"]),
  dueDate:        z.string().optional(),
  assignedToIds:  z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const buildDefaults = (task: Task): FormValues => ({
  title:         task.title,
  description:   task.description ?? "",
  priority:      task.priority,
  status:        task.status,
  dueDate:       toDateInput(task.dueDate),
  assignedToIds: task.assignments?.map((a) => a.user.id) ?? [],
});

// ── Page ──────────────────────────────────────────────────────────────────────

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask]           = useState<Task | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers]         = useState<UserOption[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!id) return;
    Promise.all([getTask(id), getUserOptions()])
      .then(([t, u]) => {
        setTask(t);
        setUsers(u);
        reset(buildDefaults(t));
      })
      .catch(() => setLoadError("Task not found."))
      .finally(() => setIsLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const updated = await updateTask(id!, {
        title:         data.title,
        description:   data.description || undefined,
        priority:      data.priority as TaskPriority,
        status:        data.status as TaskStatus,
        dueDate:       data.dueDate || undefined,
        assignedToIds: data.assignedToIds,
      });
      setTask(updated);
      reset(buildDefaults(updated));
      toast.success("Task updated.");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? "Failed to update task."
        : "An unexpected error occurred.";
      toast.error(msg);
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="flex min-h-0 flex-1 gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-64 animate-pulse rounded-xl bg-muted" />
            <div className="h-40 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-72 w-72 shrink-0 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (loadError || !task) {
    return (
      <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {loadError ?? "Task not found."}
      </p>
    );
  }

  const currentStatus    = watch("status");
  const currentPriority  = watch("priority");
  const currentAssignees = watch("assignedToIds");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex h-full flex-col gap-4">

      {/* ── Top bar: back + save/cancel ───────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/tasks">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Tasks
          </Link>
        </Button>

        {isDirty && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => reset(buildDefaults(task))}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 gap-6">

        {/* Left — scrollable: title, description, comments */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto pb-4 pr-6">

          {/* Title */}
          <div className="space-y-1">
            <Input
              {...register("title")}
              className="h-auto border-none px-0 text-2xl font-bold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Task title"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register("description")}
                placeholder="Add a description…"
                rows={8}
                className="resize-none border-none px-0 shadow-none focus-visible:ring-0"
              />
            </CardContent>
          </Card>

          {/* Comments */}
          <CommentSection taskId={task.id} />

          {/* Sticky save bar — stays at the bottom of this scroll area when dirty */}
          {isDirty && (
            <div className="sticky bottom-0 z-10 flex items-center gap-2 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              <span className="mr-auto text-sm text-muted-foreground">Unsaved changes</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => reset(buildDefaults(task))}
              >
                Discard
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          )}
        </div>

        {/* Right — details sidebar: no independent scroll */}
        <div className="w-72 shrink-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(v) => setValue("status", v as TaskStatus, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue>
                      {currentStatus && <TaskStatusBadge status={currentStatus} />}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN"><TaskStatusBadge status="OPEN" /></SelectItem>
                    <SelectItem value="IN_PROGRESS"><TaskStatusBadge status="IN_PROGRESS" /></SelectItem>
                    <SelectItem value="TESTING"><TaskStatusBadge status="TESTING" /></SelectItem>
                    <SelectItem value="DONE"><TaskStatusBadge status="DONE" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Select
                  value={currentPriority}
                  onValueChange={(v) => setValue("priority", v as TaskPriority, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue>
                      {currentPriority && <TaskPriorityBadge priority={currentPriority} />}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW"><TaskPriorityBadge priority="LOW" /></SelectItem>
                    <SelectItem value="MEDIUM"><TaskPriorityBadge priority="MEDIUM" /></SelectItem>
                    <SelectItem value="HIGH"><TaskPriorityBadge priority="HIGH" /></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Due Date</Label>
                <DatePicker
                  value={watch("dueDate")}
                  onChange={(v) => setValue("dueDate", v, { shouldDirty: true })}
                />
              </div>

              {/* Assignees */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Assignees</Label>
                <AssigneeMultiSelect
                  users={users}
                  value={currentAssignees ?? []}
                  onChange={(ids) => setValue("assignedToIds", ids, { shouldDirty: true })}
                />
              </div>

              {/* Read-only metadata */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Created by</span>
                  <span className="font-medium">{task.createdBy?.name ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(task.createdAt)}</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  );
};

export default TaskDetailPage;
