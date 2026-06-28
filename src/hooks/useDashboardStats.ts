import { useState, useEffect } from "react";
import { getDashboardStats, type DashboardStats } from "@/services/dashboardService";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
};
