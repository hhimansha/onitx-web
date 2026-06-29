import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { UserOption } from "@/services/userService";

interface Props {
  users: UserOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const AssigneeMultiSelect = ({
  users,
  value,
  onChange,
  placeholder = "Select assignees…",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleUser = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const removeUser = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  const filtered      = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  const selectedUsers = users.filter((u) => value.includes(u.id));

  return (
    <Popover.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) setSearch(""); }}>
      {/* ── Trigger ── */}
      <Popover.Trigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            open && "ring-2 ring-ring ring-offset-2"
          )}
        >
          {selectedUsers.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedUsers.map((u) => (
              <span
                key={u.id}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold">
                  {getInitials(u.name)}
                </span>
                {u.name}
                <button
                  type="button"
                  onClick={(e) => removeUser(u.id, e)}
                  className="ml-0.5 rounded-full text-primary/60 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </div>
      </Popover.Trigger>

      {/* ── Dropdown — portalled by Radix, layer-aware, safe inside Dialog ── */}
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onOpenAutoFocus={(e) => {
            e.preventDefault(); // we focus the search input manually below
          }}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "origin-top duration-[120ms]"
          )}
        >
          {/* Search */}
          <div className="border-b p-2">
            <input
              autoFocus
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No users found.</p>
            ) : (
              filtered.map((u) => {
                const selected = value.includes(u.id);
                return (
                  <div
                    key={u.id}
                    role="option"
                    aria-selected={selected}
                    onPointerDown={(e) => {
                      // Prevent Popover from closing before onClick fires
                      e.preventDefault();
                      toggleUser(u.id);
                    }}
                    className="flex cursor-pointer items-center gap-2.5 px-3 py-2 hover:bg-accent"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {getInitials(u.name)}
                    </span>
                    <span className="flex-1 text-sm">{u.name}</span>
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input"
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default AssigneeMultiSelect;
