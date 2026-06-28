export interface DashboardSummary {
  totalUsers?: number;
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  testingTasks: number;
  doneTasks: number;
  overdueTasks: number;
  tasksDueToday: number;
  tasksDueThisWeek: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
}

export interface StatusPoint {
  status: "OPEN" | "IN_PROGRESS" | "TESTING" | "DONE";
  label: string;
  count: number;
}

export interface PriorityPoint {
  priority: "HIGH" | "MEDIUM" | "LOW";
  label: string;
  count: number;
}

export interface DayPoint {
  date: string;
  count: number;
}

export interface TimelinePoint {
  label: string;
  count: number;
}

export interface Assignee {
  id: string;
  name: string;
  profileImage: string | null;
  taskCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  charts: {
    statusBreakdown: StatusPoint[];
    priorityBreakdown: PriorityPoint[];
    tasksCreatedByDay: DayPoint[];
    dueTimeline: TimelinePoint[];
    topAssignees?: Assignee[];
  };
}
