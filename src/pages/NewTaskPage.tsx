import { useNavigate } from "react-router-dom";
import TaskForm, { type TaskFormValues } from "@/components/TaskForm";
import { createTask } from "@/services/taskService";

const NewTaskPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: TaskFormValues) => {
    const task = await createTask({
      ...data,
      dueDate: data.dueDate || undefined,
      assignedToIds: data.assignedToIds?.length ? data.assignedToIds : [],
    });
    navigate(`/tasks/${task.id}`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Task</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to create a task.</p>
      </div>
      <TaskForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
};

export default NewTaskPage;
