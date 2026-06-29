import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard(userId: string) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", userId],
    queryFn: () =>
      api.get("/api/dashboard/stats").then((r) => {
        const raw = r.data;
        return (raw?.data ?? raw) as DashboardData;
      }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
