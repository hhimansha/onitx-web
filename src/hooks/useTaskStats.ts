import { useState, useEffect } from "react";
import { getTasks } from "@/services/taskService";

interface TaskStats {
  total: number;
  open: number;
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
          open: tasks.filter((t) => t.status === "OPEN").length,
          inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
          done: tasks.filter((t) => t.status === "DONE").length,
        });
      })
      .catch(() => setError("Failed to load task stats."))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
};
