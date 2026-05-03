import React, { useState } from "react";
import { X, Star, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import type { Course, Series, CalendarEvent, BacklogItem } from "../data/types";
import { getSeriesByCourse } from "../data/series";
import { estimateDurationMinutes } from "../hooks/useEstimation";
import { minutesToDisplay, todayISO } from "../lib/dateUtils";
import { eventColors } from "../lib/colors";

interface Props {
  course: Course;
  onPlanify: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  onBacklog: (item: Omit<BacklogItem, "id" | "createdAt">) => void;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-[11px] font-medium tabular-nums ml-1 text-amber-600">{rating.toFixed(1)}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: Series["userStatus"] }) {
  if (status === "done") return <Badge className="text-[10px] h-4 border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Faite</Badge>;
  if (status === "partial") return <Badge className="text-[10px] h-4 border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">Partielle</Badge>;
  return <Badge className="text-[10px] h-4 border-border bg-muted text-muted-foreground">Non faite</Badge>;
}

export function SeriesPickerPopover({ course, onPlanify, onBacklog, onClose }: Props) {
  const [type, setType] = useState<"qcm" | "lecture">("qcm");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [allNotDone, setAllNotDone] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("09:00");

  const series = getSeriesByCourse(course.id);
  const selectedSeries = series.find((s) => s.id === selectedSeriesId);
  const notDoneSeries = series.filter((s) => s.userStatus === "not_done");

  const estimatedMinutes = selectedSeries
    ? estimateDurationMinutes(selectedSeries.numberOfQuestions)
    : null;

  function buildEvent(s: Series | null, startDate: string): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> {
    const nq = s?.numberOfQuestions ?? 0;
    const dur = estimateDurationMinutes(nq) ?? 30;
    const icon = type === "qcm" ? "✍️" : "📖";
    const seriesLabel = s ? ` — ${s.year} ${s.faculty}` : "";
    return {
      type,
      courseId: course.id,
      seriesId: s?.id,
      title: `${icon} ${type === "qcm" ? "QCM" : "Lecture"} ${course.shortTitle ?? course.title}${seriesLabel}`,
      startDate,
      startTime: time,
      durationMinutes: dur,
      estimatedFromKpi: true,
      isRevision: false,
      status: "upcoming",
    };
  }

  function handlePlanify() {
    if (allNotDone && type === "qcm") {
      notDoneSeries.forEach((s, i) => {
        const d = new Date(date);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        onPlanify(buildEvent(s, dateStr));
      });
    } else {
      onPlanify(buildEvent(selectedSeries ?? null, date));
    }
    onClose();
  }

  function handleBacklog() {
    onBacklog({ type, courseId: course.id, seriesId: selectedSeries?.id });
    onClose();
  }

  const colors = eventColors[type];

  return (
    <div className="w-[540px] bg-card border border-border rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
            Cours #{course.number} · {course.specialty} · {course.day}
          </p>
          <h3 className="text-base font-bold tracking-tight">{course.title}</h3>
          <p className="text-xs text-muted-foreground">{series.length} séries disponibles</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Type toggle */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Type</p>
          <div className="flex gap-2">
            {(["qcm", "lecture"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  type === t
                    ? `${eventColors[t].badge} shadow-sm`
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {eventColors[t].icon} {t === "qcm" ? "QCM" : "Lecture"}
              </button>
            ))}
          </div>
        </div>

        {/* Series list (QCM only) */}
        {type === "qcm" && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Choisir une série (triées par notation)
            </p>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border">
              {series.map((s) => {
                const est = estimateDurationMinutes(s.numberOfQuestions);
                const isSelected = selectedSeriesId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeriesId(isSelected ? null : s.id)}
                    className={`w-full px-3 py-2.5 flex items-center gap-3 text-left transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-muted/60"
                    } ${
                      s.userStatus === "done" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <StarRating rating={s.rating} />
                        <span className="text-xs font-medium">{s.year} · {s.faculty}</span>
                        <StatusBadge status={s.userStatus} />
                        {s.userStatus === "done" && <span className="text-[10px] text-muted-foreground">(Refaire ?)</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {s.numberOfQuestions} Q{est !== null ? ` · ~${minutesToDisplay(est)}` : ""}
                      </p>
                    </div>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* All not done checkbox */}
            {notDoneSeries.length > 1 && (
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="all-not-done"
                  checked={allNotDone}
                  onCheckedChange={(v) => setAllNotDone(!!v)}
                />
                <Label htmlFor="all-not-done" className="text-xs cursor-pointer">
                  Toutes les séries non faites ({notDoneSeries.length}) — 1 par jour
                </Label>
              </div>
            )}
          </div>
        )}

        {/* Lecture summary */}
        {type === "lecture" && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-sm">
            <p className="font-medium text-emerald-700 dark:text-emerald-400">
              Lecture du cours #{course.number} — {course.title}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Durée estimée non disponible pour les lectures en V1</p>
          </div>
        )}

        {/* Date & time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Heure</p>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 p-4 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleBacklog}>
          Ajouter au backlog
        </Button>
        <Button size="sm" className="flex-1" onClick={handlePlanify}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Planifier
        </Button>
      </div>
    </div>
  );
}
