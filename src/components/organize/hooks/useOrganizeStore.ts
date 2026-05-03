import { useState, useEffect, useCallback, useRef } from "react";
import type { OrganizeState, CalendarEvent, BacklogItem, AutoModeConfig, AppNotification } from "../data/types";
import { MOCK_EVENTS } from "../data/mockEvents";
import { getExamDate } from "../data/examDate";

const STORAGE_KEY = "qe.organize.v1";

const DEFAULT_AUTO_MODE: AutoModeConfig = {
  enabled: false,
  intervals: [2, 7, 10, 30],
  customMode: false,
  preferredHour: "09:00",
};

function loadState(): OrganizeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as OrganizeState;
  } catch {
    // ignore
  }
  return {
    events: MOCK_EVENTS,
    backlog: [],
    autoMode: DEFAULT_AUTO_MODE,
    notifications: [],
    examDate: getExamDate(),
    preferences: {
      lastView: "week",
      lastDailyRitualMorning: null,
      lastDailyRitualEvening: null,
    },
  };
}

export interface OrganizeActions {
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  markEventDone: (id: string) => void;
  addEvents: (events: CalendarEvent[]) => void;
  addToBacklog: (item: BacklogItem) => void;
  removeFromBacklog: (id: string) => void;
  promoteBacklogToEvent: (item: BacklogItem, startDate: string, startTime: string) => CalendarEvent;
  setAutoMode: (config: AutoModeConfig) => void;
  setEvents: (events: CalendarEvent[]) => void;
  addNotification: (notif: AppNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setExamDate: (date: string) => void;
  setLastView: (view: "month" | "week" | "day") => void;
  setLastDailyRitualMorning: (date: string) => void;
  setLastDailyRitualEvening: (date: string) => void;
}

export function useOrganizeStore(): { state: OrganizeState; actions: OrganizeActions } {
  const [state, setState] = useState<OrganizeState>(loadState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 200);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state]);

  const update = useCallback((updater: (s: OrganizeState) => OrganizeState) => {
    setState((prev) => updater(prev));
  }, []);

  const actions: OrganizeActions = {
    addEvent: (event) => update((s) => ({ ...s, events: [...s.events, event] })),
    addEvents: (evts) => update((s) => ({ ...s, events: [...s.events, ...evts] })),
    updateEvent: (event) => update((s) => ({ ...s, events: s.events.map((e) => (e.id === event.id ? event : e)) })),
    deleteEvent: (id) => update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
    markEventDone: (id) => update((s) => ({
      ...s,
      events: s.events.map((e) =>
        e.id === id ? { ...e, status: "done" as const, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : e
      ),
    })),
    addToBacklog: (item) => update((s) => ({ ...s, backlog: [...s.backlog, item] })),
    removeFromBacklog: (id) => update((s) => ({ ...s, backlog: s.backlog.filter((b) => b.id !== id) })),
    promoteBacklogToEvent: (item, startDate, startTime) => {
      const event: CalendarEvent = {
        id: `evt-${Date.now()}`,
        type: item.type,
        courseId: item.courseId,
        seriesId: item.seriesId,
        title: "",
        startDate,
        startTime,
        durationMinutes: 30,
        estimatedFromKpi: false,
        isRevision: false,
        notes: item.notes,
        status: "upcoming",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      update((s) => ({ ...s, events: [...s.events, event], backlog: s.backlog.filter((b) => b.id !== item.id) }));
      return event;
    },
    setAutoMode: (config) => update((s) => ({ ...s, autoMode: config })),
    setEvents: (events) => update((s) => ({ ...s, events })),
    addNotification: (notif) => update((s) => ({ ...s, notifications: [notif, ...s.notifications] })),
    markNotificationRead: (id) => update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n),
    })),
    markAllNotificationsRead: () => update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => n.readAt ? n : { ...n, readAt: new Date().toISOString() }),
    })),
    setExamDate: (date) => {
      localStorage.setItem("qe.organize.examDate", date);
      update((s) => ({ ...s, examDate: date }));
    },
    setLastView: (view) => update((s) => ({ ...s, preferences: { ...s.preferences, lastView: view } })),
    setLastDailyRitualMorning: (date) => update((s) => ({ ...s, preferences: { ...s.preferences, lastDailyRitualMorning: date } })),
    setLastDailyRitualEvening: (date) => update((s) => ({ ...s, preferences: { ...s.preferences, lastDailyRitualEvening: date } })),
  };

  // TODO_SUPABASE: replace loadState with: supabase.from('organize_events').select('*').eq('user_id', userId)
  // TODO_SUPABASE: replace update calls with supabase mutations + optimistic updates

  return { state, actions };
}
