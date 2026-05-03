import { useEffect, useCallback } from "react";
import type { CalendarEvent, AppNotification } from "../data/types";
import { todayISO } from "../lib/dateUtils";

const NOTIFIED_KEY = "qe.notified.tasks";

function getNotifiedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveNotifiedSet(set: Set<string>) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(Array.from(set)));
}

export function useNotifications(
  events: CalendarEvent[],
  addNotification: (n: AppNotification) => void
) {
  const scan = useCallback(() => {
    const today = todayISO();
    const notified = getNotifiedSet();

    events
      .filter((e) => e.startDate === today && e.status === "upcoming" && !notified.has(`due-${e.id}`))
      .forEach((e) => {
        notified.add(`due-${e.id}`);
        addNotification({
          id: `notif-due-${e.id}-${Date.now()}`,
          kind: "task_due_today",
          title: "Tache aujourd'hui",
          message: `${e.title} est prevue aujourd'hui a ${e.startTime}.`,
          eventId: e.id,
          createdAt: new Date().toISOString(),
        });
      });

    events
      .filter((e) => e.type === "revision_slot" && e.status === "upcoming" && e.startDate < today && !notified.has(`overdue-${e.id}`))
      .forEach((e) => {
        notified.add(`overdue-${e.id}`);
        addNotification({
          id: `notif-overdue-${e.id}-${Date.now()}`,
          kind: "revision_overdue",
          title: "Revision en retard",
          message: `${e.title} n'a pas ete faite. Elle a ete reportee a aujourd'hui.`,
          eventId: e.id,
          createdAt: new Date().toISOString(),
        });
      });

    saveNotifiedSet(notified);
  }, [events, addNotification]);

  useEffect(() => {
    scan();
    const timer = setInterval(scan, 60_000);
    return () => clearInterval(timer);
  }, [scan]);
}
