import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/utils/cn";

// ── Constants ─────────────────────────────────────────────────────────────────

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const todayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const toIso = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const parseLocal = (iso: string) => {
  // Appending T00:00:00 forces local-time interpretation, not UTC
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

const displayDate = (iso: string) =>
  parseLocal(iso)?.toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  }) ?? "";

// ── Props ─────────────────────────────────────────────────────────────────────

interface DatePickerProps {
  value?: string;           // "YYYY-MM-DD" or ""
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) => {
  const today = todayMidnight();
  const selected = value ? parseLocal(value) : null;

  const [open, setOpen]         = useState(false);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  // ── Calendar grid ────────────────────────────────────────────────────────────

  const cells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: (Date | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(new Date(viewYear, viewMonth, d));
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, [viewYear, viewMonth]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const pickDay = (date: Date) => {
    onChange(toIso(date));
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && selected) {
          setViewYear(selected.getFullYear());
          setViewMonth(selected.getMonth());
        }
      }}
    >
      {/* Trigger */}
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm",
            "ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            !value && "text-muted-foreground",
            open && "ring-2 ring-ring ring-offset-2",
            className
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-left">{value ? displayDate(value) : placeholder}</span>
          {value && (
            <span
              role="button"
              onClick={clear}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </Popover.Trigger>

      {/* Calendar popover — Radix Portal registers with Dialog's layer system */}
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "z-50 w-72 select-none rounded-xl border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "duration-[120ms] origin-top"
          )}
        >
          {/* Month navigation */}
          <div className="mb-3 flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center text-sm font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {w}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;

              const isPast     = date < today;
              const isToday    = date.toDateString() === today.toDateString();
              const isSelected = selected ? date.toDateString() === selected.toDateString() : false;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast}
                  onClick={() => pickDay(date)}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-lg text-sm transition-colors",
                    isPast && "cursor-not-allowed text-muted-foreground/35",
                    !isPast && !isSelected && "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isToday && !isSelected && "font-bold text-primary ring-1 ring-primary/40",
                    isSelected && "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 border-t pt-3">
            <button
              type="button"
              onClick={() => pickDay(today)}
              className="w-full rounded-md py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Today
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default DatePicker;
