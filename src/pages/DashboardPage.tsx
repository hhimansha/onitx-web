import {
  ClipboardList,
  Circle,
  Timer,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  ArrowUp,
  Minus,
  ArrowDown,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/hooks/useAuth";

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  loading: boolean;
  iconClass?: string;
  valueClass?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
  iconClass = "text-muted-foreground",
  valueClass = "",
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
      ) : value === undefined ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : (
        <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
      )}
    </CardContent>
  </Card>
);

// ── Skeleton grid (reused for each section) ───────────────────────────────────

const SkeletonGrid = ({ count, cols }: { count: number; cols: string }) => (
  <div className={`grid gap-4 ${cols}`}>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// ── Section wrapper ───────────────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h2 className="text-base font-semibold text-foreground">{title}</h2>
    {children}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { stats, isLoading, error } = useDashboardStats();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s your overview.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* ── Overview ── */}
      <Section title="Overview">
        {isLoading ? (
          <SkeletonGrid count={isAdmin ? 5 : 4} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <StatCard
              title="Total Tasks"
              value={stats?.totalTasks}
              icon={ClipboardList}
              loading={false}
            />
            <StatCard
              title="Overdue"
              value={stats?.overdueTasks}
              icon={AlertTriangle}
              loading={false}
              iconClass={stats?.overdueTasks ? "text-destructive" : "text-muted-foreground"}
              valueClass={stats?.overdueTasks ? "text-destructive" : ""}
            />
            <StatCard
              title="Due Today"
              value={stats?.dueTodayTasks}
              icon={CalendarClock}
              loading={false}
              iconClass={stats?.dueTodayTasks ? "text-orange-500" : "text-muted-foreground"}
              valueClass={stats?.dueTodayTasks ? "text-orange-500" : ""}
            />
            <StatCard
              title="Due This Week"
              value={stats?.dueThisWeekTasks}
              icon={CalendarDays}
              loading={false}
              iconClass="text-muted-foreground"
            />
            {isAdmin && (
              <StatCard
                title="Total Users"
                value={stats?.totalUsers}
                icon={Users}
                loading={false}
                iconClass="text-primary"
              />
            )}
          </div>
        )}
      </Section>

      {/* ── Task Status ── */}
      <Section title="Task Status">
        {isLoading ? (
          <SkeletonGrid count={4} cols="grid-cols-2 sm:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              title="Open"
              value={stats?.openTasks}
              icon={Circle}
              loading={false}
              iconClass="text-slate-500"
            />
            <StatCard
              title="In Progress"
              value={stats?.inProgressTasks}
              icon={Timer}
              loading={false}
              iconClass="text-blue-500"
              valueClass="text-blue-600"
            />
            <StatCard
              title="Testing"
              value={stats?.testingTasks}
              icon={FlaskConical}
              loading={false}
              iconClass="text-violet-500"
              valueClass="text-violet-600"
            />
            <StatCard
              title="Done"
              value={stats?.doneTasks}
              icon={CheckCircle2}
              loading={false}
              iconClass="text-green-500"
              valueClass="text-green-600"
            />
          </div>
        )}
      </Section>

      {/* ── Priority Breakdown ── */}
      <Section title="Priority Breakdown">
        {isLoading ? (
          <SkeletonGrid count={3} cols="grid-cols-1 sm:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="High Priority"
              value={stats?.highPriorityTasks}
              icon={ArrowUp}
              loading={false}
              iconClass={stats?.highPriorityTasks ? "text-destructive" : "text-muted-foreground"}
              valueClass={stats?.highPriorityTasks ? "text-destructive" : ""}
            />
            <StatCard
              title="Medium Priority"
              value={stats?.mediumPriorityTasks}
              icon={Minus}
              loading={false}
              iconClass="text-orange-500"
            />
            <StatCard
              title="Low Priority"
              value={stats?.lowPriorityTasks}
              icon={ArrowDown}
              loading={false}
              iconClass="text-green-500"
            />
          </div>
        )}
      </Section>
    </div>
  );
};

export default DashboardPage;
