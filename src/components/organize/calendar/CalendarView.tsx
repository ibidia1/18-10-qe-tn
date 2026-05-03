import React, { useState } from "react";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import type { CalendarEvent } from "../data/types";
import { todayISO } from "../lib/dateUtils";

type View = "month" | "week" | "day";

interface Props {
  view: View;
  events: CalendarEvent[];
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (id: string) => void;
  onEventDone: (id: string) => void;
  onEventDrop: (eventId: string, newDate: string, newTime?: string) => void;
  onExecute: (event: CalendarEvent) => void;
}

export function CalendarView({ view, events, onEventEdit, onEventDelete, onEventDone, onEventDrop, onExecute }: Props) {
  const [dayViewDate, setDayViewDate] = useState(todayISO());

  if (view === "month") {
    return (
      <MonthView
        events={events}
        onDayClick={(date) => setDayViewDate(date)}
        onEventEdit={onEventEdit}
        onEventDelete={onEventDelete}
        onEventDone={onEventDone}
        onEventDrop={onEventDrop}
      />
    );
  }

  if (view === "week") {
    return (
      <WeekView
        events={events}
        onEventEdit={onEventEdit}
        onEventDelete={onEventDelete}
        onEventDone={onEventDone}
        onEventDrop={onEventDrop}
        onExecute={onExecute}
      />
    );
  }

  return (
    <DayView
      initialDate={dayViewDate}
      events={events}
      onEventEdit={onEventEdit}
      onEventDelete={onEventDelete}
      onEventDone={onEventDone}
      onExecute={onExecute}
    />
  );
}
