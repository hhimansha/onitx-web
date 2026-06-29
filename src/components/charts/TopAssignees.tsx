import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Assignee } from "@/types/dashboard";

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export function TopAssignees({ data }: { data: Assignee[] }) {
  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        No assignment data yet.
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.taskCount - a.taskCount).slice(0, 7);
  const max = sorted[0]?.taskCount || 1;

  return (
    <div className="space-y-1">
      {sorted.map((a, i) => (
        <div key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60">
          <span className="w-4 shrink-0 text-center text-xs font-medium text-muted-foreground">
            {i + 1}
          </span>
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={a.profileImage ?? undefined} alt={a.name} />
            <AvatarFallback className="text-[10px] font-bold">
              {getInitials(a.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{a.name}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${(a.taskCount / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {a.taskCount}
          </span>
        </div>
      ))}
    </div>
  );
}
