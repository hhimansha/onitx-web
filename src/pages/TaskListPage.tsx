import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil, Trash2, Plus, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";

import { getTasks, deleteTask, updateTask, createTask } from "@/services/taskService";
import { getUserOptions, type UserOption } from "@/services/userService";
import type { Task, TaskStatus, TaskPriority } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import TaskForm, { type TaskFormValues } from "@/components/TaskForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import TaskPriorityBadge from "@/components/TaskPriorityBadge";
import KanbanBoard from "@/components/kanban/KanbanBoard";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
};

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ── Page ──────────────────────────────────────────────────────────────────────

const TaskListPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // ── URL param state ──────────────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();

  const paramView       = (searchParams.get("view")       ?? "board") as "board" | "table";
  const paramStatus     = searchParams.get("status")       ?? "all";
  const paramPriority   = searchParams.get("priority")     ?? "all";
  const paramAssignedTo = searchParams.get("assignedToId") ?? "all";
  const paramQ          = searchParams.get("q")            ?? "";

  const [searchInput, setSearchInput] = useState(paramQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Task data ────────────────────────────────────────────────────────────────
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [newTaskOpen, setNewTaskOpen]   = useState(false);

  // ── User options (admin only) ────────────────────────────────────────────────
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    getUserOptions().then(setUserOptions).catch(() => {});
  }, [isAdmin]);

  // ── Fetch tasks on filter change ─────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const filters: Record<string, string> = {};
    if (paramQ)                    filters.q            = paramQ;
    if (paramStatus !== "all")     filters.status       = paramStatus;
    if (paramPriority !== "all")   filters.priority     = paramPriority;
    if (paramAssignedTo !== "all") filters.assignedToId = paramAssignedTo;

    getTasks(filters)
      .then(setTasks)
      .catch(() => setError("Failed to load tasks."))
      .finally(() => setIsLoading(false));
  }, [paramQ, paramStatus, paramPriority, paramAssignedTo]);

  // ── Param helpers ────────────────────────────────────────────────────────────
  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const setView = (v: "board" | "table") => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (v === "board") next.delete("view");
      else next.set("view", v);
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("q", value), 300);
  };

  // ── New task ─────────────────────────────────────────────────────────────────
  const handleCreateTask = async (data: TaskFormValues) => {
    const created = await createTask({
      ...data,
      dueDate: data.dueDate || undefined,
      assignedToIds: data.assignedToIds?.length ? data.assignedToIds : [],
    });
    setTasks((prev) => [created, ...prev]);
    setNewTaskOpen(false);
    toast.success(`"${created.title}" created.`);
  };

  // ── Kanban status change ─────────────────────────────────────────────────────
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const original = tasks.find((t) => t.id === taskId);
    if (!original) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    try {
      await updateTask(taskId, { status: newStatus });
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? original : t)));
      toast.error("Failed to move task.");
    }
  };

  // ── Delete (shared by table actions + board 3-dot menu) ───────────────────────
  const handleBoardDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch {
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <Button onClick={() => setNewTaskOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Task
        </Button>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Filters + view toggle on the same row */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search tasks…"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full sm:w-56"
        />

        <Select value={paramStatus} onValueChange={(v) => setParam("status", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue>
              {paramStatus === "all"
                ? <span className="text-muted-foreground">All statuses</span>
                : <TaskStatusBadge status={paramStatus as TaskStatus} />}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="OPEN"><TaskStatusBadge status="OPEN" /></SelectItem>
            <SelectItem value="IN_PROGRESS"><TaskStatusBadge status="IN_PROGRESS" /></SelectItem>
            <SelectItem value="TESTING"><TaskStatusBadge status="TESTING" /></SelectItem>
            <SelectItem value="DONE"><TaskStatusBadge status="DONE" /></SelectItem>
          </SelectContent>
        </Select>

        <Select value={paramPriority} onValueChange={(v) => setParam("priority", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue>
              {paramPriority === "all"
                ? <span className="text-muted-foreground">All priorities</span>
                : <TaskPriorityBadge priority={paramPriority as TaskPriority} />}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="LOW"><TaskPriorityBadge priority="LOW" /></SelectItem>
            <SelectItem value="MEDIUM"><TaskPriorityBadge priority="MEDIUM" /></SelectItem>
            <SelectItem value="HIGH"><TaskPriorityBadge priority="HIGH" /></SelectItem>
          </SelectContent>
        </Select>

        {isAdmin && (
          <Select value={paramAssignedTo} onValueChange={(v) => setParam("assignedToId", v)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {userOptions.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* View toggle — pushed to the far right */}
        <div className="ml-auto flex overflow-hidden rounded-lg border">
          <button
            onClick={() => setView("board")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
              paramView === "board"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="Board view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Board
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 border-l px-3 py-1.5 text-sm font-medium transition-colors",
              paramView === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="Table view"
          >
            <List className="h-3.5 w-3.5" />
            Table
          </button>
        </div>
      </div>

      {/* ── Board view ── */}
      {paramView === "board" && (
        <KanbanBoard
          tasks={tasks}
          loading={isLoading}
          onStatusChange={handleTaskStatusChange}
          onDeleteTask={handleBoardDeleteTask}
        />
      )}

      {/* ── Table view ── */}
      {paramView === "table" && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="hidden lg:table-cell">Assignees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    {searchParams.size > 0 ? "No tasks match your filters." : "No tasks yet."}
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const visible  = task.assignments?.slice(0, 4) ?? [];
                  const overflow = Math.max(0, (task.assignments?.length ?? 0) - 4);
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <Link to={`/tasks/${task.id}`} className="hover:underline">
                          {task.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <TaskPriorityBadge priority={task.priority} />
                      </TableCell>
                      <TableCell>
                        <TaskStatusBadge status={task.status} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </TableCell>

                      {/* Assignee avatars with CSS tooltip */}
                      <TableCell className="hidden lg:table-cell">
                        {visible.length > 0 ? (
                          <div className="flex -space-x-1.5">
                            {visible.map((a) => (
                              <div key={a.user.id} className="group/av relative">
                                <Avatar className="h-7 w-7 ring-2 ring-background">
                                  <AvatarImage src={a.user.profileImage ?? undefined} alt={a.user.name} />
                                  <AvatarFallback className="text-[10px] font-semibold">
                                    {getInitials(a.user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                {/* Tooltip */}
                                <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 group-hover/av:block">
                                  <div className="rounded-md bg-foreground px-2 py-1 text-[11px] font-medium whitespace-nowrap text-background shadow-lg">
                                    {a.user.name}
                                  </div>
                                  <div className="mx-auto h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-foreground" />
                                </div>
                              </div>
                            ))}
                            {overflow > 0 && (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold ring-2 ring-background">
                                +{overflow}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/tasks/${task.id}`} aria-label="Edit task">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setTaskToDelete(task)}
                            aria-label="Delete task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New Task dialog */}
      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>Fill in the details to create a new task.</DialogDescription>
          </DialogHeader>
          <TaskForm
            mode="create"
            onSubmit={handleCreateTask}
            onCancel={() => setNewTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(taskToDelete)} onOpenChange={() => setTaskToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                &quot;{taskToDelete?.title}&quot;
              </span>?{" "}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskListPage;
