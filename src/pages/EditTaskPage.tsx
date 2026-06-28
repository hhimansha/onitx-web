import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm, { type TaskFormValues } from "@/components/TaskForm";
import { getTask, updateTask } from "@/services/taskService";
import type { Task } from "@/types";

// Convert ISO timestamp → "YYYY-MM-DD" for the date input
const toDateInput = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
};

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  const handleSubmit = async (data: TaskFormValues) => {
    await updateTask(id!, {
      ...data,
      dueDate: data.dueDate || undefined,
      assignedToIds: data.assignedToIds ?? [],
    });
    navigate(`/tasks/${id}`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Task</h1>
        <p className="text-sm text-muted-foreground">Update the task details below.</p>
      </div>
      <TaskForm
        mode="edit"
        defaultValues={{
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,
          status: task.status,
          dueDate: toDateInput(task.dueDate),
          assignedToIds: task.assignments?.map((a) => a.user.id) ?? [],
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditTaskPage;
