import React from "react";
import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import type { CalendarEvent } from "../data/types";
import { eventColors } from "../lib/colors";
import { minutesToDisplay, todayISO } from "../lib/dateUtils";

interface Props {
  events: CalendarEvent[];
  onMarkDone: (id: string) => void;
  onExecute: (event: CalendarEvent) => void;
}

export function TodayAgendaPanel({ events, onMarkDone, onExecute }: Props) {
  const today = todayISO();
  const todayEvents = events
    .filter((e) => e.startDate === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const doneCount = todayEvents.filter((e) => e.status === "done").length;
  const totalMinutes = todayEvents.reduce((s, e) => s + e.durationMinutes, 0);

  return (
    <Card className="bg-gradient-to-br from-card to-primary/[0.03] dark:to-primary/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center justify-between">
          <span>Aujourd'hui</span>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {doneCount}/{todayEvents.length}
          </span>
        </CardTitle>
        {todayEvents.length > 0 && (
          <p className="text-[11px] text-muted-foreground tabular-nums">
            ~{minutesToDisplay(totalMinutes)} planifie(e)s
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {todayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune tache aujourd'hui</p>
        ) : (
          <div className="space-y-2">
            {todayEvents.map((evt) => {
              const colors = eventColors[evt.type];
              const isDone = evt.status === "done";
              return (
                <div
                  key={evt.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border-l-2 ${colors.border} ${colors.bg} ${
                    isDone ? "opacity-60" : ""
                  }`}
                >
                  <span className="text-sm">{colors.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isDone ? "line-through text-muted-foreground" : ""}`}>
                      {evt.title || `Cours #${evt.courseId}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {evt.startTime} · {minutesToDisplay(evt.durationMinutes)}
                    </p>
                  </div>
                  {!isDone && (
                    <button
                      onClick={() =>
                        evt.type === "revision_slot" ? onExecute(evt) : onMarkDone(evt.id)
                      }
                      className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded text-xs transition-colors ${
                        evt.type === "revision_slot"
                          ? "text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                          : "text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/40"
                      }`}
                    >
                      {evt.type === "revision_slot" ? "▶" : <CheckCircle className="h-4 w-4" />}
                    </button>
                  )}
                  {isDone && <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
