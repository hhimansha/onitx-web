import {
  ClipboardList, Circle, Timer, AlertTriangle,
  CalendarClock, Users, type LucideIcon, TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/cn";
import { StatusDonut } from "@/components/charts/StatusDonut";
import { PriorityBar } from "@/components/charts/PriorityBar";
import { CreationTrend } from "@/components/charts/CreationTrend";
import { DueTimeline } from "@/components/charts/DueTimeline";
import { TopAssignees } from "@/components/charts/TopAssignees";

// ── Gradient hero card (Total Tasks / Total Users) ────────────────────────────

interface HeroCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  variant: "primary" | "dark";
  loading: boolean;
  subtext?: string;
  dimInDark?: boolean;
}

const HeroCard = ({ title, value, icon: Icon, variant, loading, subtext, dimInDark = false }: HeroCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const lightGradient =
    variant === "primary"
      ? "bg-gradient-to-br from-[#1b17ff] via-[#1511dd] to-[#0d0b99]"
      : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950";

  const darkGradient = dimInDark
    ? "bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.07]"
    : "bg-gradient-to-br from-white/[0.22] to-white/[0.12] border border-white/[0.18]";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 shadow-sm",
        isDark ? darkGradient : lightGradient
      )}
    >
      {/* Background decoration (light mode only) */}
      {!isDark && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            isDark ? "bg-white/10" : "bg-white/15"
          )}
        >
          <Icon className={cn("h-5 w-5", isDark ? "text-foreground" : "text-white")} />
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className={cn("h-10 w-20 animate-pulse rounded-lg", isDark ? "bg-white/10" : "bg-white/20")} />
        ) : (
          <p className={cn("text-5xl font-bold tracking-tight", isDark ? "text-foreground" : "text-white")}>
            {value ?? 0}
          </p>
        )}
        <p className={cn("mt-1.5 text-sm font-medium", isDark ? "text-muted-foreground" : "text-white/75")}>
          {title}
        </p>
        {!loading && subtext && (
          <p className={cn("mt-2 text-xs", isDark ? "text-muted-foreground/80" : "text-white/55")}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

// ── Regular stat card ─────────────────────────────────────────────────────────

interface RegularCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  accentColor: string;
  bgColor: string;
  barColor: string;
  loading: boolean;
  progress?: number;
  subtext?: string;
}

const RegularCard = ({
  title, value, icon: Icon, accentColor, bgColor, barColor, loading, progress, subtext,
}: RegularCardProps) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bgColor)}>
          <Icon className={cn("h-5 w-5", accentColor)} />
        </div>
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="h-10 w-20 animate-pulse rounded-lg bg-muted" />
        ) : (
          <p className={cn("text-5xl font-bold tracking-tight", accentColor)}>{value ?? 0}</p>
        )}
        <p className="mt-1.5 text-sm font-medium text-muted-foreground">{title}</p>
        {!loading && typeof progress === "number" && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-500", barColor)}
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
        )}
        {!loading && subtext && (
          <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

// ── Mini dark card (Overdue / Due Today) ──────────────────────────────────────

interface MiniCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  loading: boolean;
  colorVariant?: "red" | "amber";
  subtext?: string;
}

const MiniDarkCard = ({ title, value, icon: Icon, loading, colorVariant, subtext }: MiniCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Light mode: dark gradient (same as before)
  const lightBg = (value ?? 0) > 0
    ? "bg-gradient-to-br from-zinc-800 to-zinc-950"
    : "bg-gradient-to-br from-zinc-700 to-zinc-900";

  // Dark mode: colored white-tinted gradients so cards don't look plain
  const darkBg =
    colorVariant === "red"
      ? "bg-gradient-to-br from-red-950/60 to-red-950/20 border border-red-900/30"
      : colorVariant === "amber"
      ? "bg-gradient-to-br from-amber-950/55 to-amber-950/20 border border-amber-900/25"
      : "bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08]";

  const iconBg = isDark ? "bg-white/10" : "bg-white/15";

  const iconColor = isDark
    ? colorVariant === "red"
      ? "text-red-400"
      : colorVariant === "amber"
      ? "text-amber-400"
      : "text-foreground"
    : "text-white";

  const titleColor = isDark
    ? colorVariant === "red"
      ? "text-red-300/60"
      : colorVariant === "amber"
      ? "text-amber-300/60"
      : "text-muted-foreground"
    : "text-white/70";

  const valueColor = isDark
    ? colorVariant === "red"
      ? "text-red-200"
      : colorVariant === "amber"
      ? "text-amber-200"
      : "text-foreground"
    : "text-white";

  const subtextColor = isDark
    ? colorVariant === "red"
      ? "text-red-400/60"
      : colorVariant === "amber"
      ? "text-amber-400/60"
      : "text-muted-foreground/70"
    : "text-white/50";

  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-4 rounded-2xl p-5 shadow-sm",
        isDark ? darkBg : lightBg
      )}
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs font-medium", titleColor)}>{title}</p>
        {loading ? (
          <div className={cn("mt-1 h-7 w-12 animate-pulse rounded-md", isDark ? "bg-white/10" : "bg-white/20")} />
        ) : (
          <p className={cn("text-3xl font-bold tracking-tight", valueColor)}>
            {value ?? 0}
          </p>
        )}
        {!loading && subtext && (
          <p className={cn("mt-0.5 text-[11px] font-medium", subtextColor)}>{subtext}</p>
        )}
      </div>
    </div>
  );
};

// ── Chart card shell ──────────────────────────────────────────────────────────

const ChartCard = ({
  title, children, loading,
}: {
  title: string; children: React.ReactNode; loading: boolean;
}) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader className="pb-2 pt-5">
      <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pb-5">
      {loading ? (
        <div className="h-[240px] animate-pulse rounded-xl bg-muted" />
      ) : (
        children
      )}
    </CardContent>
  </Card>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────

const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />
);

// ── Page ──────────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboard(user?.id ?? "");

  const isAdmin = data?.summary.totalUsers !== undefined;
  const s = data?.summary;
  const c = data?.charts;

  // Computed secondary stats for card details
  const totalAll  = s?.totalTasks        ?? 0;
  const totalDone = s?.doneTasks         ?? 0;
  const totalOpen = s?.openTasks         ?? 0;
  const totalProg = s?.inProgressTasks   ?? 0;
  const highCount = s?.highPriorityTasks ?? 0;
  const weekCount = s?.tasksDueThisWeek  ?? 0;

  const openPct = totalAll ? Math.round((totalOpen / totalAll) * 100) : 0;
  const progPct = totalAll ? Math.round((totalProg / totalAll) * 100) : 0;

  const taskSubtext = totalAll > 0
    ? `${totalDone} completed · ${highCount} high priority`
    : undefined;

  const overdueSubtext =
    (s?.overdueTasks ?? 0) > 0 ? "Needs attention" : "All clear";

  const dueTodaySubtext =
    (s?.tasksDueToday ?? 0) > 0
      ? `${weekCount} due this week`
      : "Nothing due today";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here&apos;s your overview.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      )}

      {/* ── Row 1 — Stat cards ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Overview
        </h2>

        {isLoading ? (
          <div className={cn(
            "grid gap-4",
            isAdmin
              ? "grid-cols-2 xl:grid-cols-5"
              : "grid-cols-2 lg:grid-cols-4"
          )}>
            {Array.from({ length: isAdmin ? 5 : 4 }).map((_, i) => (
              <CardSkeleton key={i} className="h-36" />
            ))}
          </div>
        ) : (
          <div className={cn(
            "grid items-stretch gap-4",
            isAdmin
              ? "grid-cols-2 xl:grid-cols-5"
              : "grid-cols-2 lg:grid-cols-4"
          )}>
            {/* Admin: Total Users (dark gradient) */}
            {isAdmin && (
              <HeroCard
                title="Total Users"
                value={s?.totalUsers}
                icon={Users}
                variant="dark"
                loading={false}
              />
            )}

            {/* Total Tasks (primary gradient) */}
            <HeroCard
              title="Total Tasks"
              value={s?.totalTasks}
              icon={ClipboardList}
              variant="primary"
              loading={false}
              subtext={taskSubtext}
              dimInDark={isAdmin}
            />

            {/* Open */}
            <RegularCard
              title="Open"
              value={s?.openTasks}
              icon={Circle}
              accentColor="text-blue-500"
              bgColor="bg-blue-50 dark:bg-blue-950/40"
              barColor="bg-blue-500"
              loading={false}
              progress={openPct}
              subtext={totalAll > 0 ? `${openPct}% of total tasks` : undefined}
            />

            {/* In Progress */}
            <RegularCard
              title="In Progress"
              value={s?.inProgressTasks}
              icon={Timer}
              accentColor="text-amber-500"
              bgColor="bg-amber-50 dark:bg-amber-950/40"
              barColor="bg-amber-500"
              loading={false}
              progress={progPct}
              subtext={totalAll > 0 ? `${progPct}% of total tasks` : undefined}
            />

            {/* Overdue + Due Today stacked */}
            <div className="flex flex-col gap-3">
              <MiniDarkCard
                title="Overdue"
                value={s?.overdueTasks}
                icon={AlertTriangle}
                loading={false}
                colorVariant="red"
                subtext={overdueSubtext}
              />
              <MiniDarkCard
                title="Due Today"
                value={s?.tasksDueToday}
                icon={CalendarClock}
                loading={false}
                colorVariant="amber"
                subtext={dueTodaySubtext}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Row 2 — Charts ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard title="Status Breakdown" loading={isLoading}>
            <StatusDonut data={c?.statusBreakdown ?? []} />
          </ChartCard>

          <ChartCard title="Priority Breakdown" loading={isLoading}>
            <PriorityBar data={c?.priorityBreakdown ?? []} />
          </ChartCard>

          {isAdmin ? (
            <ChartCard title="Top Assignees" loading={isLoading}>
              <TopAssignees data={c?.topAssignees ?? []} />
            </ChartCard>
          ) : (
            <ChartCard title="Due Timeline" loading={isLoading}>
              <DueTimeline data={c?.dueTimeline ?? []} />
            </ChartCard>
          )}
        </div>
      </section>

      {/* ── Row 3 — Activity ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Activity
        </h2>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2 pt-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Tasks Created — Last 7 Days</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-5">
            {isLoading ? (
              <div className="h-[240px] animate-pulse rounded-xl bg-muted" />
            ) : (
              <CreationTrend data={c?.tasksCreatedByDay ?? []} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
