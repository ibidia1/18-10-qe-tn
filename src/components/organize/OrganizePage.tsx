import React, { useState, useCallback, useMemo } from "react";
import { Plus, Layout } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { OrganizeHeader } from "./header/OrganizeHeader";
import { CourseSearchModal } from "./search/CourseSearchModal";
import { CalendarView } from "./calendar/CalendarView";
import { BacklogPanel } from "./panels/BacklogPanel";
import { TodayAgendaPanel } from "./panels/TodayAgendaPanel";
import { AutoModeConfigPanel } from "./panels/AutoModeConfig";
import { NotificationsBell } from "./panels/NotificationsBell";
import { RevisionHeatmap } from "./views/RevisionHeatmap";
import { MacroPlanView } from "./views/MacroPlanView";
import { AddTaskDialog } from "./modals/AddTaskDialog";
import { ExecuteTaskDialog } from "./modals/ExecuteTaskDialog";
import { DailyRitualMorningDialog } from "./modals/DailyRitualMorningDialog";
import { DailyRitualEveningDialog } from "./modals/DailyRitualEveningDialog";
import { TemplateLibraryDialog } from "./modals/TemplateLibraryDialog";

import { useOrganizeStore } from "./hooks/useOrganizeStore";
import { useSpacedRepetition } from "./hooks/useSpacedRepetition";
import { useNotifications } from "./hooks/useNotifications";
import { useDailyRitual } from "./hooks/useDailyRitual";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

import type { CalendarEvent, BacklogItem } from "./data/types";
import { todayISO, addDays } from "./lib/dateUtils";

type View = "month" | "week" | "day";

export function OrganizePage() {
  const { state, actions } = useOrganizeStore();
  const [view, setView] = useState<View>(
    (state.preferences.lastView as View) ?? "week"
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [executeEvent, setExecuteEvent] = useState<CalendarEvent | null>(null);

  // Daily ritual
  const { showMorning, showEvening, dismissMorning, dismissEvening } =
    useDailyRitual(
      state.preferences.lastDailyRitualMorning,
      state.preferences.lastDailyRitualEvening
    );

  // Notifications scanner
  useNotifications(state.events, actions.addNotification);

  // Spaced repetition / reschedule
  useSpacedRepetition(
    state.events,
    state.autoMode,
    actions.setEvents,
    actions.addNotification,
    actions.addEvents
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "mod+k": () => setSearchOpen(true),
    n: () => setAddTaskOpen(true),
  });

  // --- Event handlers ---

  const handleEventDrop = useCallback(
    (eventId: string, newDate: string, newTime?: string) => {
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return;
      if (newDate < todayISO()) return; // block past drops
      actions.updateEvent({
        ...event,
        startDate: newDate,
        startTime: newTime ?? event.startTime,
        updatedAt: new Date().toISOString(),
      });
    },
    [state.events, actions]
  );

  const handleEventDone = useCallback(
    (id: string) => {
      actions.markEventDone(id);
      // If auto-mode enabled, generate revisions
      if (state.autoMode.enabled) {
        const event = state.events.find((e) => e.id === id);
        if (event && event.type !== "revision_slot") {
          const doneEvent = { ...event, status: "done" as const };
          const revisions = ([] as CalendarEvent[]);
          state.autoMode.intervals.forEach((days) => {
            revisions.push({
              id: `evt-rev-${Date.now()}-${days}`,
              type: "revision_slot",
              courseId: event.courseId,
              title: `🔁 Révision J${days} — Cours #${event.courseId}`,
              startDate: addDays(event.startDate, days),
              startTime: state.autoMode.preferredHour,
              durationMinutes: event.durationMinutes,
              estimatedFromKpi: event.estimatedFromKpi,
              isRevision: true,
              revisionInterval: `J${days}`,
              parentEventId: event.id,
              status: "upcoming",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          });
          actions.addEvents(revisions);
        }
      }
    },
    [state.events, state.autoMode, actions]
  );

  const handlePlanify = useCallback(
    (partial: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      actions.addEvent({ ...partial, id: `evt-${Date.now()}`, createdAt: now, updatedAt: now });
    },
    [actions]
  );

  const handleBacklog = useCallback(
    (partial: Omit<BacklogItem, "id" | "createdAt">) => {
      actions.addToBacklog({ ...partial, id: `bl-${Date.now()}`, createdAt: new Date().toISOString() });
    },
    [actions]
  );

  const handleExecuteLaunch = useCallback(
    (event: CalendarEvent, type: "qcm" | "lecture", seriesId?: string) => {
      actions.updateEvent({ ...event, type, seriesId, updatedAt: new Date().toISOString() });
      actions.markEventDone(event.id);
      // Navigate stub — in production, route to S'entrainer/Apprendre
      console.log("[QE.tn] Launch", type, event.title, seriesId);
    },
    [actions]
  );

  const handlePostpone = useCallback(
    (eventId: string) => {
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return;
      const tomorrow = addDays(event.startDate, 1);
      actions.updateEvent({ ...event, startDate: tomorrow, updatedAt: new Date().toISOString() });
    },
    [state.events, actions]
  );

  const handleApplyTemplate = useCallback(
    (evts: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">[]) => {
      const now = new Date().toISOString();
      const toAdd: CalendarEvent[] = evts.map((e, i) => ({
        ...e,
        id: `evt-tpl-${Date.now()}-${i}`,
        createdAt: now,
        updatedAt: now,
      }));
      actions.addEvents(toAdd);
    },
    [actions]
  );

  // Generated revisions count this week
  const generatedRevCount = useMemo(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const weekStartStr = weekStart.toISOString().slice(0, 10);
    const weekEnd = addDays(weekStartStr, 6);
    return state.events.filter(
      (e) =>
        e.type === "revision_slot" &&
        e.startDate >= weekStartStr &&
        e.startDate <= weekEnd
    ).length;
  }, [state.events]);

  return (
    <div className="flex flex-col gap-4 max-w-[1200px] mx-auto">
      {/* Header */}
      <OrganizeHeader
        state={state}
        actions={actions}
        view={view}
        onViewChange={setView}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Main tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="h-8">
            <TabsTrigger value="calendar" className="text-xs h-7 px-3">Calendrier</TabsTrigger>
            <TabsTrigger value="macro" className="text-xs h-7 px-3">Plan macro</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setTemplateOpen(true)}
            >
              <Layout className="h-3.5 w-3.5 mr-1" /> Templates
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={() => setAddTaskOpen(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter (N)
            </Button>
          </div>
        </div>

        <TabsContent value="calendar" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
            {/* Left: calendar */}
            <div className="min-w-0">
              <CalendarView
                view={view}
                events={state.events}
                onEventEdit={(evt) => {
                  // open edit dialog — for now reuse add dialog stub
                  console.log("Edit", evt.id);
                }}
                onEventDelete={actions.deleteEvent}
                onEventDone={handleEventDone}
                onEventDrop={handleEventDrop}
                onExecute={(evt) => setExecuteEvent(evt)}
              />
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">
              <TodayAgendaPanel
                events={state.events}
                onMarkDone={handleEventDone}
                onExecute={(evt) => setExecuteEvent(evt)}
              />

              <BacklogPanel
                backlog={state.backlog}
                onRemove={actions.removeFromBacklog}
                onAddClick={() => setAddTaskOpen(true)}
                onPromote={(item, date, time) =>
                  actions.promoteBacklogToEvent(item, date, time)
                }
              />

              {state.autoMode.enabled && (
                <AutoModeConfigPanel
                  config={state.autoMode}
                  onUpdate={actions.setAutoMode}
                  generatedCount={generatedRevCount}
                />
              )}

              {!state.autoMode.enabled && (
                <div
                  className="p-3 rounded-lg border border-dashed border-border text-center cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => actions.setAutoMode({ ...state.autoMode, enabled: true })}
                >
                  <p className="text-xs font-medium">Activer le mode auto</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Revisions J2/J7/J10/J30 automatiques
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="macro" className="mt-4 space-y-4">
          <MacroPlanView examDate={state.examDate} events={state.events} />
        </TabsContent>
      </Tabs>

      {/* Heatmap */}
      <RevisionHeatmap events={state.events} />

      {/* Modals */}
      <CourseSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPlanify={handlePlanify}
        onBacklog={handleBacklog}
      />

      <AddTaskDialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onPlanify={handlePlanify}
        onBacklog={handleBacklog}
      />

      <ExecuteTaskDialog
        event={executeEvent}
        open={!!executeEvent}
        onClose={() => setExecuteEvent(null)}
        onLaunch={handleExecuteLaunch}
      />

      <DailyRitualMorningDialog
        open={showMorning}
        events={state.events}
        onClose={() => {
          dismissMorning();
          actions.setLastDailyRitualMorning(todayISO());
        }}
        onPostpone={handlePostpone}
      />

      <DailyRitualEveningDialog
        open={showEvening}
        events={state.events}
        onClose={() => {
          dismissEvening();
          actions.setLastDailyRitualEvening(todayISO());
        }}
        onPostpone={handlePostpone}
      />

      <TemplateLibraryDialog
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onApply={handleApplyTemplate}
      />
    </div>
  );
}
