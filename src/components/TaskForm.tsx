import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getUsers } from "@/services/userService";
import type { User } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ── Schema ────────────────────────────────────────────────────────────────

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["OPEN", "IN_PROGRESS", "TESTING", "DONE"]),
  dueDate: z.string().optional(),
  assignedToIds: z.array(z.string()).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

// ── Reusable styled native select ─────────────────────────────────────────

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >
    {children}
  </select>
));
NativeSelect.displayName = "NativeSelect";

// ── Props ─────────────────────────────────────────────────────────────────

interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────

const TaskForm = ({ mode, defaultValues, onSubmit }: TaskFormProps) => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

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
    getUsers()
      .then(setUsers)
      .catch(() => {}); // fail silently — dropdown just shows "Unassigned"
  }, []);

  const handleSubmit = async (data: TaskFormValues) => {
    setApiError(null);
    try {
      await onSubmit(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setApiError(
          (err.response?.data as { message?: string })?.message ??
            "Something went wrong. Please try again."
        );
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
        {/* Title */}
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

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional — describe the task in more detail"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority + Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <NativeSelect {...field}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </NativeSelect>
                </FormControl>
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
                <FormControl>
                  <NativeSelect {...field}>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="TESTING">Testing</option>
                    <option value="DONE">Done</option>
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Due Date + Assigned User */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <div className="max-h-40 overflow-y-auto rounded-md border border-input bg-background p-3 space-y-2">
                    {users.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No users available</p>
                    ) : (
                      users.map((u) => {
                        const checked = field.value?.includes(u.id) ?? false;
                        return (
                          <label key={u.id} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  e.target.checked
                                    ? [...current, u.id]
                                    : current.filter((id) => id !== u.id)
                                );
                              }}
                              className="h-4 w-4 rounded border-input accent-primary"
                            />
                            <span>{u.name}</span>
                            {u.designation && (
                              <span className="text-xs text-muted-foreground">· {u.designation}</span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {apiError && (
          <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {apiError}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create Task"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
