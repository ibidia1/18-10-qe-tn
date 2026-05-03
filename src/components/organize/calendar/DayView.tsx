import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { EventCard } from "./EventCard";
import type { CalendarEvent } from "../data/types";
import { todayISO, formatDateFR, formatDayFR } from "../lib/dateUtils";

interface Props {
  initialDate?: string;
  events: CalendarEvent[];
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (id: string) => void;
  onEventDone: (id: string) => void;
  onExecute: (event: CalendarEvent) => void;
}

export function DayView({ initialDate, events, onEventEdit, onEventDelete, onEventDone, onExecute }: Props) {
  const [dateStr, setDateStr] = useState(initialDate ?? todayISO());
  const dayEvents = events.filter((e) => e.startDate === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));

  function prev() {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    setDateStr(d.toISOString().slice(0, 10));
  }
  function next() {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    setDateStr(d.toISOString().slice(0, 10));
  }

  const totalMinutes = dayEvents.reduce((acc, e) => acc + e.durationMinutes, 0);
  const doneCount = dayEvents.filter((e) => e.status === "done").length;

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={prev} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-base font-bold tracking-tight capitalize">
            {formatDayFR(dateStr, true)} {new Date(dateStr).getDate()} {formatDateFR(dateStr).split(" ").slice(1, 2).join("")}
          </h2>
          {dayEvents.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {doneCount}/{dayEvents.length} taches faites
              {totalMinutes > 0 && ` · ~${Math.round(totalMinutes / 60 * 10) / 10}h planifiees`}
            </p>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={next} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Events */}
      {dayEvents.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Aucune tache ce jour</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onEdit={() => onEventEdit(evt)}
              onDelete={() => onEventDelete(evt.id)}
              onMarkDone={() => onEventDone(evt.id)}
              onExecute={() => onExecute(evt)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
