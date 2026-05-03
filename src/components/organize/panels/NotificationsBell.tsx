import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import type { AppNotification } from "../data/types";
import { relativeTime } from "../lib/dateUtils";

const KIND_ICONS: Record<string, string> = {
  task_due_today: "📅",
  revision_overdue: "⚠️",
  daily_ritual_morning: "👋",
  daily_ritual_evening: "🌙",
  auto_reschedule: "🔁",
  milestone: "🔥",
};

interface Props {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationsBell({ notifications, unreadCount, onMarkRead, onMarkAllRead }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-bold">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-primary hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Aucune notification</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 border-b border-border/50 last:border-0 ${
                    !n.readAt ? "bg-primary/5" : ""
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{KIND_ICONS[n.kind] ?? "📖"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1 tabular-nums">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.readAt && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="flex-shrink-0 text-[10px] text-primary hover:underline self-start mt-1"
                    >
                      Lu
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
