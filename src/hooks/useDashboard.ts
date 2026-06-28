import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () =>
      api.get("/api/dashboard/stats").then((r) => {
        const raw = r.data;
        // unwrap { success, data: { summary, charts } }
        return (raw?.data ?? raw) as DashboardData;
      }),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
