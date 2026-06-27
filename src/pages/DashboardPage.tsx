import { ClipboardList, Circle, Timer, CheckCircle2, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStats } from "@/hooks/useTaskStats";

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: LucideIcon;
  loading: boolean;
}

const StatCard = ({ title, value, icon: Icon, loading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
      ) : (
        <p className="text-3xl font-bold">{value ?? 0}</p>
      )}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { stats, isLoading, error } = useTaskStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your tasks.</p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats?.total}
          icon={ClipboardList}
          loading={isLoading}
        />
        <StatCard
          title="Open"
          value={stats?.todo}
          icon={Circle}
          loading={isLoading}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress}
          icon={Timer}
          loading={isLoading}
        />
        <StatCard
          title="Done"
          value={stats?.done}
          icon={CheckCircle2}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
