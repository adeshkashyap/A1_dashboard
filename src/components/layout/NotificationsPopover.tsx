import { useState } from "react";
import { Bell, CalendarDays, MessageCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEMO_NOTIFICATIONS = [
  {
    id: "n1",
    title: "New lead from WhatsApp",
    body: "Vikram Singh asked about 3BHK in Bandra.",
    time: "12 min ago",
    icon: UserPlus,
    unread: true,
  },
  {
    id: "n2",
    title: "Visit tomorrow",
    body: "Meera Joshi — Sea View 3BHK at 11:00 AM.",
    time: "1 hr ago",
    icon: CalendarDays,
    unread: true,
  },
  {
    id: "n3",
    title: "WhatsApp connected",
    body: "EstateFlow AI is online and answering leads.",
    time: "Today",
    icon: MessageCircle,
    unread: true,
  },
];

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => n.unread && !readIds.has(n.id))
    .length;

  const markAllRead = () => {
    setReadIds(new Set(DEMO_NOTIFICATIONS.map((n) => n.id)));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(100vw-2rem,22rem)] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {DEMO_NOTIFICATIONS.map((n) => {
            const Icon = n.icon;
            const isUnread = n.unread && !readIds.has(n.id);
            return (
              <li
                key={n.id}
                className={cn(
                  "flex gap-3 px-4 py-3 border-b last:border-0",
                  isUnread && "bg-muted/40"
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
                  <p className="text-[11px] text-muted-foreground/80">{n.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
