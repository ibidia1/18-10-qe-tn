import type { CalendarEvent, AutoModeConfig } from "../data/types";
import { addDays, todayISO } from "./dateUtils";

let _idCounter = Date.now();
function uuid(): string {
  return `evt-${_idCounter++}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateRevisions(
  parent: CalendarEvent,
  config: AutoModeConfig
): CalendarEvent[] {
  if (!config.enabled) return [];
  const now = new Date().toISOString();
  return config.intervals.map((days) => ({
    id: uuid(),
    type: "revision_slot" as const,
    courseId: parent.courseId,
    title: `🔁 Révision J${days} — Cours #${parent.courseId}`,
    startDate: addDays(parent.startDate, days),
    startTime: config.preferredHour,
    durationMinutes: parent.durationMinutes,
    estimatedFromKpi: parent.estimatedFromKpi,
    isRevision: true,
    revisionInterval: `J${days}`,
    parentEventId: parent.id,
    status: "upcoming" as const,
    createdAt: now,
    updatedAt: now,
  }));
}

export function rescheduleOverdueRevisions(events: CalendarEvent[]): CalendarEvent[] {
  const today = todayISO();
  return events.map((e) => {
    if (
      e.type === "revision_slot" &&
      e.status === "upcoming" &&
      e.startDate < today
    ) {
      return { ...e, startDate: today, status: "rescheduled" as const, updatedAt: new Date().toISOString() };
    }
    return e;
  });
}

export function calculateStreak(events: CalendarEvent[]): number {
  const doneDates = new Set(
    events.filter((e) => e.status === "done" && e.completedAt)
      .map((e) => e.completedAt!.slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (doneDates.has(dateStr)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function calculateBestStreak(events: CalendarEvent[]): number {
  const doneDates = new Set(
    events.filter((e) => e.status === "done" && e.completedAt)
      .map((e) => e.completedAt!.slice(0, 10))
  );
  const sorted = Array.from(doneDates).sort();
  let best = 0;
  let current = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev) {
      const prevDate = new Date(prev);
      prevDate.setDate(prevDate.getDate() + 1);
      if (prevDate.toISOString().slice(0, 10) === d) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    prev = d;
  }
  return best;
}

export const PLAN_TEMPLATES = [
  {
    id: "marathon-3-mois",
    name: "Marathon — 3 mois avant résidanat",
    description: "Couvre les 75 cours en 12 semaines, rythme intensif",
    durationWeeks: 12,
    weeklyDistribution: { lectures: 6, qcmSeries: 8, revisions: 5 },
  },
  {
    id: "sprint-flash",
    name: "Sprint flash — 2 semaines",
    description: "Révisions ciblées sur les cours non maîtrisés",
    durationWeeks: 2,
    weeklyDistribution: { lectures: 0, qcmSeries: 12, revisions: 15 },
  },
  {
    id: "fond-6-mois",
    name: "Fond — 6 mois en douceur",
    description: "Apprentissage progressif, 1-2h par jour",
    durationWeeks: 24,
    weeklyDistribution: { lectures: 3, qcmSeries: 4, revisions: 3 },
  },
];
