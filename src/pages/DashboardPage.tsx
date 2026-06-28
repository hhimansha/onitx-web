import {
  ClipboardList, Circle, Timer, AlertTriangle,
  CalendarClock, CheckCircle2, Users, type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { StatusDonut } from "@/components/charts/StatusDonut";
import { PriorityBar } from "@/components/charts/PriorityBar";
import { CreationTrend } from "@/components/charts/CreationTrend";
import { DueTimeline } from "@/components/charts/DueTimeline";
import { TopAssignees } from "@/components/charts/TopAssignees";

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  iconClass?: string;
  valueClass?: string;
  loading: boolean;
}

const StatCard = ({
  title, value, icon: Icon,
  iconClass = "text-muted-foreground",
  valueClass = "",
  loading,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 shrink-0 ${iconClass}`} />
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
      ) : (
        <p className={`text-3xl font-bold ${valueClass}`}>{value ?? 0}</p>
      )}
    </CardContent>
  </Card>
);

// ── Chart card shell ──────────────────────────────────────────────────────────

const ChartCard = ({
  title, children, loading,
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-[220px] animate-pulse rounded-md bg-muted" />
      ) : (
        children
      )}
    </CardContent>
  </Card>
);

// ── Stat row skeleton ─────────────────────────────────────────────────────────

const StatSkeleton = ({ count }: { count: number }) => (
  <>
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
  </>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { data, isLoading, error } = useDashboard();
  const { user } = useAuth();

  // Per the backend spec: totalUsers is absent for non-admins
  const isAdmin = data?.summary.totalUsers !== undefined;
  const s = data?.summary;
  const c = data?.charts;

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
          Failed to load dashboard data.
        </p>
      )}

      {/* ── Row 1 — Stat cards ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {isLoading ? (
            <StatSkeleton count={isAdmin ? 6 : 5} />
          ) : (
            <>
              {isAdmin && (
                <StatCard
                  title="Total Users"
                  value={s?.totalUsers}
                  icon={Users}
                  iconClass="text-primary"
                  loading={false}
                />
              )}
              <StatCard
                title="Total Tasks"
                value={s?.totalTasks}
                icon={ClipboardList}
                loading={false}
              />
              <StatCard
                title="Open"
                value={s?.openTasks}
                icon={Circle}
                iconClass="text-blue-500"
                valueClass="text-blue-600"
                loading={false}
              />
              <StatCard
                title="In Progress"
                value={s?.inProgressTasks}
                icon={Timer}
                iconClass="text-amber-500"
                valueClass="text-amber-600"
                loading={false}
              />
              <StatCard
                title="Overdue"
                value={s?.overdueTasks}
                icon={AlertTriangle}
                iconClass={s?.overdueTasks ? "text-destructive" : "text-muted-foreground"}
                valueClass={s?.overdueTasks ? "text-destructive" : ""}
                loading={false}
              />
              <StatCard
                title="Due Today"
                value={s?.tasksDueToday}
                icon={CalendarClock}
                iconClass={s?.tasksDueToday ? "text-orange-500" : "text-muted-foreground"}
                valueClass={s?.tasksDueToday ? "text-orange-500" : ""}
                loading={false}
              />
              <StatCard
                title="Completed"
                value={s?.doneTasks}
                icon={CheckCircle2}
                iconClass="text-green-500"
                valueClass="text-green-600"
                loading={false}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Row 2 — Status donut + Priority bar ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Task Status</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Status Breakdown" loading={isLoading}>
            <StatusDonut data={c?.statusBreakdown ?? []} />
          </ChartCard>
          <ChartCard title="Priority Breakdown" loading={isLoading}>
            <PriorityBar data={c?.priorityBreakdown ?? []} />
          </ChartCard>
        </div>
      </section>

      {/* ── Row 3 — 7-day creation trend (full width) ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Activity</h2>
        <ChartCard title="Tasks Created — Last 7 Days" loading={isLoading}>
          <CreationTrend data={c?.tasksCreatedByDay ?? []} />
        </ChartCard>
      </section>

      {/* ── Row 4 — Due timeline + Top assignees (admin) ── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Due Dates &amp; Assignments</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Due Timeline" loading={isLoading}>
            <DueTimeline data={c?.dueTimeline ?? []} />
          </ChartCard>
          {isAdmin && (
            <ChartCard title="Top Assignees" loading={isLoading}>
              <TopAssignees data={c?.topAssignees ?? []} />
            </ChartCard>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
