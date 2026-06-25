import { useParams } from "react-router-dom";

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Task</h1>
      <p className="text-muted-foreground">Task ID: {id}</p>
      <p className="text-muted-foreground">Edit task form coming soon.</p>
    </div>
  );
};

export default EditTaskPage;
