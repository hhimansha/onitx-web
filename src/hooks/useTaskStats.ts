import { useState, useEffect } from "react";
import { getTasks } from "@/services/taskService";

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export const useTaskStats = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        setStats({
          total: tasks.length,
          todo: tasks.filter((t) => t.status === "todo").length,
          inProgress: tasks.filter((t) => t.status === "in_progress").length,
          done: tasks.filter((t) => t.status === "done").length,
        });
      })
      .catch(() => setError("Failed to load task stats."))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
};
