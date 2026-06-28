import api from "./api";

export interface DashboardStats {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  testingTasks: number;
  doneTasks: number;
  overdueTasks: number;
  dueTodayTasks: number;
  dueThisWeekTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
  totalUsers?: number;
}

const unwrap = <T>(raw: unknown): T => {
  if (raw !== null && typeof raw === "object" && !Array.isArray(raw) && "success" in raw) {
    return (raw as { success: boolean; data: T }).data;
  }
  return raw as T;
};

export const getDashboardStats = () =>
  api.get<unknown>("/api/dashboard/stats").then((res) => unwrap<DashboardStats>(res.data));
