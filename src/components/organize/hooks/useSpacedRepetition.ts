import { useEffect, useCallback } from "react";
import type { CalendarEvent, AutoModeConfig, AppNotification } from "../data/types";
import { rescheduleOverdueRevisions, generateRevisions, calculateStreak } from "../lib/spacedRepetitionAlgo";

const MILESTONE_STREAKS = [3, 7, 14, 30, 60, 100];

export function useSpacedRepetition(
  events: CalendarEvent[],
  config: AutoModeConfig,
  setEvents: (events: CalendarEvent[]) => void,
  addNotification: (n: AppNotification) => void,
  addEvents: (evts: CalendarEvent[]) => void
) {
  const reschedule = useCallback(() => {
    const rescheduled = rescheduleOverdueRevisions(events);
    const anyChanged = rescheduled.some((e, i) => e.startDate !== events[i]?.startDate || e.status !== events[i]?.status);
    if (anyChanged) {
      setEvents(rescheduled);
      addNotification({
        id: `notif-reschedule-${Date.now()}`,
        kind: "auto_reschedule",
        title: "Revisions decalees",
        message: "Des revisions en retard ont ete reportees a aujourd'hui.",
        createdAt: new Date().toISOString(),
      });
    }
  }, [events, setEvents, addNotification]);

  useEffect(() => {
    reschedule();
    const timer = setInterval(reschedule, 60_000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const streak = calculateStreak(events);
    if (MILESTONE_STREAKS.includes(streak)) {
      const key = `qe.streak.notified.${streak}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        addNotification({
          id: `notif-milestone-${streak}-${Date.now()}`,
          kind: "milestone",
          title: `${streak} jours d'affilee !`,
          message: `Incroyable ! Tu as etudie ${streak} jours consecutifs. Bravo Dr. Sarah !`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }, [events, addNotification]);

  const triggerRevisions = useCallback(
    (completedEvent: CalendarEvent) => {
      const revisions = generateRevisions(completedEvent, config);
      if (revisions.length > 0) addEvents(revisions);
    },
    [config, addEvents]
  );

  return { triggerRevisions };
}
