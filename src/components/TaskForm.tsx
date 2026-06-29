import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getUserOptions, type UserOption } from "@/services/userService";
import AssigneeMultiSelect from "@/components/AssigneeMultiSelect";
import TaskPriorityBadge from "@/components/TaskPriorityBadge";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import type { TaskPriority, TaskStatus } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/DatePicker";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ── Schema ────────────────────────────────────────────────────────────────────

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "TESTING", "DONE"]),
  dueDate: z.string().optional(),
  assignedToIds: z.array(z.string()).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => Promise<void>;
  onCancel?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const TaskForm = ({ mode, defaultValues, onSubmit, onCancel }: TaskFormProps) => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
      dueDate: "",
      assignedToIds: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    getUserOptions().then(setUsers).catch(() => {});
  }, []);

  const handleSubmit = async (data: TaskFormValues) => {
    setApiError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      setApiError(
        axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ?? "Something went wrong."
          : "An unexpected error occurred."
      );
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-5">

        {/* ── Two-column body ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 items-stretch gap-x-6 py-3">

          {/* Left: title + description — fills available height */}
          <div className="col-span-3 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description"
                      className="flex-1 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right: priority / status / due date / assignees */}
          <div className="col-span-2 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority">
                          {field.value && (
                            <TaskPriorityBadge priority={field.value as TaskPriority} />
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">
                        <TaskPriorityBadge priority="LOW" />
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <TaskPriorityBadge priority="MEDIUM" />
                      </SelectItem>
                      <SelectItem value="HIGH">
                        <TaskPriorityBadge priority="HIGH" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status">
                          {field.value && (
                            <TaskStatusBadge status={field.value as TaskStatus} />
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">
                        <TaskStatusBadge status="OPEN" />
                      </SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        <TaskStatusBadge status="IN_PROGRESS" />
                      </SelectItem>
                      <SelectItem value="TESTING">
                        <TaskStatusBadge status="TESTING" />
                      </SelectItem>
                      <SelectItem value="DONE">
                        <TaskStatusBadge status="DONE" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedToIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <FormControl>
                    <AssigneeMultiSelect
                      users={users}
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {apiError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {apiError}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create" ? "Creating…" : "Saving…"
              : mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
