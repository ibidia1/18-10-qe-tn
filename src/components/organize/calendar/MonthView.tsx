import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { EventCard } from "./EventCard";
import type { CalendarEvent } from "../data/types";
import { getMonthDates, formatMonthYearFR, todayISO, isPast } from "../lib/dateUtils";

interface Props {
  events: CalendarEvent[];
  onDayClick: (date: string) => void;
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (id: string) => void;
  onEventDone: (id: string) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function MonthView({ events, onDayClick, onEventEdit, onEventDelete, onEventDone, onEventDrop }: Props) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = getMonthDates(year, month);
  const todayStr = todayISO();

  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }

  return (
    <div className="flex flex-col gap-2">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-sm font-bold tracking-tight capitalize">{formatMonthYearFR(viewDate)}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((dateStr, i) => {
          if (!dateStr) {
            return <div key={`empty-${i}`} className="min-h-[80px]" />;
          }

          const dayEvents = events.filter((e) => e.startDate === dateStr);
          const isToday = dateStr === todayStr;
          const isPastDay = isPast(dateStr) && !isToday;
          const isDropTarget = dragOverDate === dateStr;
          const isPastDrop = isPast(dateStr);

          return (
            <div
              key={dateStr}
              className={`min-h-[80px] rounded-lg border transition-colors cursor-pointer
                ${ isToday ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:border-primary/40" }
                ${ isPastDay ? "opacity-70" : "" }
                ${ isDropTarget && !isPastDrop ? "bg-primary/10 border-primary" : "" }
                ${ isDropTarget && isPastDrop ? "bg-red-50/50 border-red-300" : "" }
              `}
              onClick={() => onDayClick(dateStr)}
              onDragOver={(e) => { e.preventDefault(); setDragOverDate(dateStr); }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDate(null);
                if (draggingId && !isPastDrop) {
                  onEventDrop(draggingId, dateStr);
                } else if (draggingId && isPastDrop) {
                  // toast would go here
                }
                setDraggingId(null);
              }}
            >
              {/* Day number */}
              <div className={`text-xs font-medium p-1.5 ${
                isToday ? "text-primary font-bold" : isPastDay ? "text-muted-foreground" : "text-foreground"
              }`}>
                {new Date(dateStr).getDate()}
              </div>

              {/* Events */}
              <div className="px-1 pb-1 space-y-0.5">
                {dayEvents.slice(0, 3).map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    compact
                    draggable
                    onDragStart={(e) => { e.dataTransfer.setData("eventId", evt.id); setDraggingId(evt.id); }}
                    onEdit={() => onEventEdit(evt)}
                    onDelete={() => onEventDelete(evt.id)}
                    onMarkDone={() => onEventDone(evt.id)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 3} autres</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
