import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { Button } from "../../ui/button";
import { EventCard } from "./EventCard";
import type { CalendarEvent } from "../data/types";
import { getWeekDates, formatDateShortFR, formatDayFR, todayISO, isPast, timeToMinutes, minutesToTime } from "../lib/dateUtils";
import { exportWeekToPdf } from "../lib/pdfExport";
import { daysUntilExam } from "../data/examDate";

interface Props {
  events: CalendarEvent[];
  onEventEdit: (event: CalendarEvent) => void;
  onEventDelete: (id: string) => void;
  onEventDone: (id: string) => void;
  onEventDrop: (eventId: string, newDate: string, newTime?: string) => void;
  onExecute: (event: CalendarEvent) => void;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 - 23:00
const MIN_PER_PX = 1; // 1px = 1 minute at 60px/hour
const PX_PER_HOUR = 60;

export function WeekView({ events, onEventEdit, onEventDelete, onEventDone, onEventDrop, onExecute }: Props) {
  const today = todayISO();
  const [refDate, setRefDate] = useState(new Date());
  const weekDates = getWeekDates(refDate);
  const [dragOverSlot, setDragOverSlot] = useState<{ date: string; hour: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function prevWeek() { const d = new Date(refDate); d.setDate(d.getDate() - 7); setRefDate(d); }
  function nextWeek() { const d = new Date(refDate); d.setDate(d.getDate() + 7); setRefDate(d); }
  function goToday() { setRefDate(new Date()); }

  const weekLabel = `Semaine du ${formatDateShortFR(weekDates[0])} au ${formatDateShortFR(weekDates[6])}`;

  return (
    <div className="qe-print-area flex flex-col gap-2">
      {/* Week navigation */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="icon" onClick={prevWeek} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={goToday} className="h-8 text-xs">
          Aujourd'hui
        </Button>
        <span className="text-sm font-medium">{weekLabel}</span>
        <Button variant="outline" size="icon" onClick={nextWeek} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs qe-no-print"
          onClick={() => exportWeekToPdf(weekLabel, "Sarah", daysUntilExam())}
        >
          <Printer className="h-3.5 w-3.5 mr-1" /> PDF
        </Button>
      </div>

      {/* Grid */}
      <div className="overflow-auto">
        <div className="min-w-[640px]">
          {/* Day headers */}
          <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-border sticky top-0 bg-background z-10">
            <div />
            {weekDates.map((dateStr) => (
              <div
                key={dateStr}
                className={`text-center py-2 text-xs ${
                  dateStr === today ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                <p className="font-semibold uppercase tracking-wider">{formatDayFR(dateStr)}</p>
                <p className={`text-lg font-bold tabular-nums mt-0.5 ${ dateStr === today ? "text-primary" : "" }`}>
                  {new Date(dateStr).getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-[48px_repeat(7,1fr)]" style={{ height: `${PX_PER_HOUR}px` }}>
                <div className="text-[10px] text-muted-foreground text-right pr-2 pt-0 tabular-nums leading-none">
                  {hour}:00
                </div>
                {weekDates.map((dateStr) => {
                  const isPastSlot = isPast(dateStr);
                  const isDropTarget = dragOverSlot?.date === dateStr && dragOverSlot?.hour === hour;
                  return (
                    <div
                      key={dateStr}
                      className={`border-l border-b border-border/50 relative ${
                        dateStr === today ? "bg-primary/5" : ""
                      } ${
                        isDropTarget && !isPastSlot ? "bg-primary/15" : ""
                      } ${
                        isDropTarget && isPastSlot ? "bg-red-50/50" : ""
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragOverSlot({ date: dateStr, hour }); }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOverSlot(null);
                        if (draggingId && !isPastSlot) {
                          onEventDrop(draggingId, dateStr, `${hour.toString().padStart(2, "0")}:00`);
                        }
                        setDraggingId(null);
                      }}
                    />
                  );
                })}
              </div>
            ))}

            {/* Event blocks positioned absolutely */}
            {weekDates.map((dateStr, colIdx) => {
              const dayEvents = events.filter((e) => e.startDate === dateStr);
              return dayEvents.map((evt) => {
                const startMin = timeToMinutes(evt.startTime);
                const topPx = (startMin - 6 * 60) * (PX_PER_HOUR / 60);
                const heightPx = Math.max(evt.durationMinutes * (PX_PER_HOUR / 60), 20);
                const leftPct = (1 / 7) * colIdx * 100 + (48 / 100); // approximate
                const widthPct = 100 / 7;

                return (
                  <div
                    key={evt.id}
                    className="absolute px-0.5"
                    style={{
                      top: `${topPx}px`,
                      height: `${heightPx}px`,
                      left: `calc(48px + ${colIdx} * ((100% - 48px) / 7))`,
                      width: `calc((100% - 48px) / 7 - 4px)`,
                    }}
                  >
                    <EventCard
                      event={evt}
                      compact={heightPx < 36}
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData("eventId", evt.id); setDraggingId(evt.id); }}
                      onEdit={() => onEventEdit(evt)}
                      onDelete={() => onEventDelete(evt.id)}
                      onMarkDone={() => onEventDone(evt.id)}
                      onExecute={() => onExecute(evt)}
                    />
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
