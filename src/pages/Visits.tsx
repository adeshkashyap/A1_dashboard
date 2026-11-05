import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { type Visit } from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ViewMode = "week" | "list";

const statusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
    icon: XCircle,
  },
} as const;

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function Visits() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: visits = [], isLoading } = useQuery({
    queryKey: ["visits"],
    queryFn: () => api.visits.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Visit["status"] }) =>
      api.visits.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      toast.success("Visit updated");
    },
  });

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date());
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const filtered = visits.filter(
    (v) => statusFilter === "all" || v.status === statusFilter
  );

  const weekVisits = filtered.filter((v) => {
    const d = new Date(v.scheduledAt);
    return weekDays.some((day) => sameDay(day, d));
  });

  const counts = {
    scheduled: visits.filter((v) => v.status === "SCHEDULED").length,
    completed: visits.filter((v) => v.status === "COMPLETED").length,
    cancelled: visits.filter((v) => v.status === "CANCELLED").length,
  };

  return (
    <DashboardLayout title="Visits">
      <div className="space-y-6 animate-fade-in">
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-semibold">{counts.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-sky-500/70" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold">{counts.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/70" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-semibold">{counts.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-rose-500/70" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {viewMode === "week" && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w - 1)}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
                  This week
                </Button>
                <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
                  Next
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <Card className="border-dashed border-2 shadow-none">
            <CardContent className="py-16 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No visits yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Site visits will show here once leads are scheduled.
              </p>
              <Button variant="outline" disabled>
                Schedule visit
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && viewMode === "week" && filtered.length > 0 && (
          <div className="grid gap-3 md:grid-cols-7 overflow-x-auto">
            {weekDays.map((day) => {
              const dayVisits = weekVisits.filter((v) =>
                sameDay(new Date(v.scheduledAt), day)
              );
              const isToday = sameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-w-[140px] rounded-xl border bg-card p-3 space-y-2",
                    isToday && "border-primary/50 ring-1 ring-primary/20"
                  )}
                >
                  <p className={cn("text-xs font-medium", isToday ? "text-primary" : "text-muted-foreground")}>
                    {formatDayLabel(day)}
                  </p>
                  {dayVisits.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">—</p>
                  ) : (
                    dayVisits.map((visit) => (
                      <VisitChip
                        key={visit.id}
                        visit={visit}
                        compact
                        onStatus={(status) =>
                          updateMutation.mutate({ id: visit.id, status })
                        }
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && viewMode === "list" && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((visit) => (
              <VisitChip
                key={visit.id}
                visit={visit}
                onStatus={(status) =>
                  updateMutation.mutate({ id: visit.id, status })
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function VisitChip({
  visit,
  compact,
  onStatus,
}: {
  visit: Visit;
  compact?: boolean;
  onStatus: (status: Visit["status"]) => void;
}) {
  const cfg = statusConfig[visit.status];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div className="rounded-lg bg-muted/50 p-2 space-y-1 text-left">
        <p className="text-xs font-medium truncate">{formatTime(visit.scheduledAt)}</p>
        <p className="text-xs truncate">{visit.buyerName}</p>
        <Badge variant="outline" className={cn("text-[10px] px-1.5", cfg.className)}>
          {cfg.label}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn(cfg.className)}>
              <Icon className="h-3 w-3 mr-1" />
              {cfg.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(visit.scheduledAt).toLocaleString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h3 className="font-semibold truncate">{visit.propertyTitle}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {visit.buyerName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {visit.location}
            </span>
            {visit.assignedRepName && (
              <span className="flex items-center gap-1">
                Rep: {visit.assignedRepName}
              </span>
            )}
          </div>
          {visit.notes && (
            <p className="text-sm text-muted-foreground">{visit.notes}</p>
          )}
        </div>
        {visit.status === "SCHEDULED" && (
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatus("COMPLETED")}
            >
              Complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => onStatus("CANCELLED")}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
