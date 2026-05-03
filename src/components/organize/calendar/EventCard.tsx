import React from "react";
import { CheckCircle, Clock, Edit, Trash2, Play } from "lucide-react";
import { Badge } from "../../ui/badge";
import type { CalendarEvent } from "../data/types";
import { eventColors } from "../lib/colors";
import { minutesToDisplay, isPast } from "../lib/dateUtils";
import { COURSES } from "../data/courses";

interface Props {
  event: CalendarEvent;
  compact?: boolean;
  draggable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkDone?: () => void;
  onExecute?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
}

export function EventCard({ event, compact = false, draggable = false, onEdit, onDelete, onMarkDone, onExecute, onDragStart }: Props) {
  const colors = eventColors[event.type];
  const course = COURSES.find((c) => c.id === event.courseId);
  const isDone = event.status === "done";
  const isOverdue = isPast(event.startDate) && event.status === "upcoming";
  const isRevision = event.isRevision || event.type === "revision_slot";

  const borderClass = isOverdue ? "border-l-red-500" : colors.border;
  const opacity = isDone ? "opacity-60" : "";

  if (compact) {
    return (
      <div
        draggable={draggable}
        onDragStart={onDragStart}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border-l-2 ${borderClass} ${colors.bg} ${opacity} cursor-${draggable ? "grab" : "default"} truncate`}
      >
        <span>{colors.icon}</span>
        <span className="truncate">{event.title || `Cours #${event.courseId}`}</span>
        {isDone && <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0 ml-auto" />}
      </div>
    );
  }

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`group relative rounded-lg border border-l-4 ${borderClass} ${colors.bg} p-3 ${opacity} cursor-${draggable ? "grab" : "default"} transition-all hover:shadow-sm`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm">{colors.icon}</span>
          <p className={`text-sm font-medium truncate ${
            isDone ? "line-through text-muted-foreground" : ""
          }`}>
            {event.title || `Cours #${event.courseId}`}
          </p>
          {isRevision && (
            <Badge className="text-[10px] h-4 border-dashed border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex-shrink-0">
              {event.revisionInterval ?? "Rev"}
            </Badge>
          )}
          {isOverdue && (
            <Badge className="text-[10px] h-4 border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 flex-shrink-0">
              En retard
            </Badge>
          )}
          {isDone && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />}
        </div>

        {/* Action buttons - show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {isRevision && !isDone && onExecute && (
            <button onClick={onExecute} className="h-6 w-6 flex items-center justify-center rounded text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors" title="Executer">
              <Play className="h-3 w-3" />
            </button>
          )}
          {!isDone && onMarkDone && (
            <button onClick={onMarkDone} className="h-6 w-6 flex items-center justify-center rounded text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors" title="Marquer comme fait">
              <CheckCircle className="h-3 w-3" />
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors">
              <Edit className="h-3 w-3" />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
        <span className="tabular-nums">{event.startTime}</span>
        <span className="flex items-center gap-0.5">
          <Clock className="h-3 w-3" />
          <span className="tabular-nums">{minutesToDisplay(event.durationMinutes)}</span>
        </span>
        {course && <span className="truncate">{course.specialty}</span>}
      </div>
    </div>
  );
}
