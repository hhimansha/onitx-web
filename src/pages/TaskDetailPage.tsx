import { useParams } from "react-router-dom";

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Task Detail</h1>
      <p className="text-muted-foreground">Task ID: {id}</p>
      <p className="text-muted-foreground">Task details coming soon.</p>
    </div>
  );
};

export default TaskDetailPage;
