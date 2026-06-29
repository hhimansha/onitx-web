import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { Search } from "lucide-react";

import { getAdminUsers } from "@/services/userService";
import type { UserWithStats } from "@/types";
import { useAuth } from "@/hooks/useAuth";

import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ── Avatar ────────────────────────────────────────────────────────────────────

const UserAvatar = ({ user }: { user: UserWithStats }) => (
  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
    {user.profileImage ? (
      <img
        src={user.profileImage}
        alt={user.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
        {initials(user.name)}
      </div>
    )}
  </div>
);

// ── Skeleton cell widths per column index ─────────────────────────────────────

const SKELETON_CLASSES: string[] = [
  "",                         // 0  avatar
  "",                         // 1  name
  "hidden sm:table-cell",     // 2  email
  "",                         // 3  role
  "hidden md:table-cell",     // 4  open
  "hidden md:table-cell",     // 5  in progress
  "hidden md:table-cell",     // 6  done
  "hidden md:table-cell",     // 7  joined
];

// ── Page ──────────────────────────────────────────────────────────────────────

type SortField = "name" | "email" | "createdAt" | "taskCount";
type SortOrder = "asc" | "desc";

const UsersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // ── URL params ───────────────────────────────────────────────────────────────
  const [searchParams, setSearchParams] = useSearchParams();
  const paramQ         = searchParams.get("q")          ?? "";
  const paramSortBy    = (searchParams.get("sortBy")    ?? "name") as SortField;
  const paramSortOrder = (searchParams.get("sortOrder") ?? "asc")  as SortOrder;

  // Local search input debounced into URL
  const [searchInput, setSearchInput] = useState(paramQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────────
  const [users, setUsers]         = useState<UserWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    setIsLoading(true);
    getAdminUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setIsLoading(false));
  }, [isAdmin]);

  // ── Param helpers ────────────────────────────────────────────────────────────
  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("q", value), 300);
  };

  // ── Client-side filter + sort ─────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = paramQ.toLowerCase();
    const result = q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      : [...users];

    result.sort((a, b) => {
      let cmp = 0;
      switch (paramSortBy) {
        case "name":      cmp = a.name.localeCompare(b.name); break;
        case "email":     cmp = a.email.localeCompare(b.email); break;
        case "createdAt": cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
        case "taskCount": cmp = (a.taskCount ?? 0) - (b.taskCount ?? 0); break;
      }
      return paramSortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [users, paramQ, paramSortBy, paramSortOrder]);

  // Guard: non-admins redirected after hooks run
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading…"
            : `${filteredUsers.length} user${filteredUsers.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={paramSortBy} onValueChange={(v) => setParam("sortBy", v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="taskCount">Task Count</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paramSortOrder} onValueChange={(v) => setParam("sortOrder", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell text-right">Open</TableHead>
              <TableHead className="hidden md:table-cell text-right">In Progress</TableHead>
              <TableHead className="hidden md:table-cell text-right">Done</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {SKELETON_CLASSES.map((cls, j) => (
                    <TableCell key={j} className={cls}>
                      {j === 0 ? (
                        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                      ) : (
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  {paramQ ? "No users match your search." : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <UserAvatar user={u} />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium leading-tight">{u.name}</div>
                    {u.designation && (
                      <div className="text-xs text-muted-foreground">{u.designation}</div>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right tabular-nums text-blue-600">
                    {u.openTasks ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right tabular-nums text-amber-600">
                    {u.inProgressTasks ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-right tabular-nums text-green-600">
                    {u.doneTasks ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {formatDate(u.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersPage;
