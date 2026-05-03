import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { CalendarEvent, BacklogItem } from "../data/types";
import { COURSES } from "../data/courses";
import { getSeriesByCourse } from "../data/series";
import { estimateDurationMinutes } from "../hooks/useEstimation";
import { todayISO } from "../lib/dateUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  onPlanify: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  onBacklog: (item: Omit<BacklogItem, "id" | "createdAt">) => void;
  initialDate?: string;
}

export function AddTaskDialog({ open, onClose, onPlanify, onBacklog, initialDate }: Props) {
  const [type, setType] = useState<"qcm" | "lecture">("qcm");
  const [courseId, setCourseId] = useState<string>("");
  const [seriesId, setSeriesId] = useState<string>("");
  const [date, setDate] = useState(initialDate ?? todayISO());
  const [time, setTime] = useState("09:00");
  const [durationManual, setDurationManual] = useState<string>("");
  const [notes, setNotes] = useState("");

  const selectedCourseId = parseInt(courseId, 10);
  const course = COURSES.find((c) => c.id === selectedCourseId);
  const series = course ? getSeriesByCourse(course.id) : [];
  const selectedSeries = series.find((s) => s.id === seriesId);

  const autoEstimate =
    type === "qcm" && selectedSeries
      ? estimateDurationMinutes(selectedSeries.numberOfQuestions)
      : null;

  const durationMinutes = durationManual
    ? parseInt(durationManual, 10)
    : autoEstimate ?? 30;

  const isEstimated = !durationManual && autoEstimate !== null;

  function handlePlanify() {
    if (!course) return;
    const icon = type === "qcm" ? "✍️" : "📖";
    const seriesLabel = selectedSeries ? ` — ${selectedSeries.year} ${selectedSeries.faculty}` : "";
    const title = `${icon} ${type === "qcm" ? "QCM" : "Lecture"} ${course.shortTitle ?? course.title}${seriesLabel}`;
    onPlanify({
      type,
      courseId: course.id,
      seriesId: selectedSeries?.id,
      title,
      startDate: date,
      startTime: time,
      durationMinutes,
      estimatedFromKpi: isEstimated,
      isRevision: false,
      notes: notes || undefined,
      status: "upcoming",
    });
    onClose();
  }

  function handleBacklog() {
    if (!course) return;
    onBacklog({ type, courseId: course.id, seriesId: selectedSeries?.id, notes: notes || undefined });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight">Ajouter une tache</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</Label>
            <div className="flex gap-2">
              {(["qcm", "lecture"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setSeriesId(""); }}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    type === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "qcm" ? "✍️ QCM" : "📖 Lecture"}
                </button>
              ))}
            </div>
          </div>

          {/* Cours */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cours</Label>
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setSeriesId(""); }}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Choisir un cours..." />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {COURSES.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-sm">
                    #{c.number} {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serie (QCM only) */}
          {type === "qcm" && course && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Serie</Label>
              <Select value={seriesId} onValueChange={setSeriesId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Choisir une serie..." />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {series.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="text-sm">
                      {s.year} {s.faculty} · {s.numberOfQuestions}Q · {s.rating.toFixed(1)}★
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date + heure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heure</Label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          {/* Duree */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Duree (min)
              {isEstimated && (
                <span className="ml-2 normal-case font-normal text-muted-foreground">
                  — Estimee depuis tes statistiques
                </span>
              )}
            </Label>
            <Input
              type="number"
              min="5"
              step="5"
              value={durationManual || (autoEstimate ?? "")}
              placeholder={autoEstimate !== null ? String(autoEstimate) : ""}
              onChange={(e) => setDurationManual(e.target.value)}
              className="h-9 text-sm tabular-nums"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notes <span className="normal-case font-normal">(optionnel)</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 280))}
              placeholder="Ajouter une note..."
              className="text-sm resize-none h-16"
            />
            <p className="text-[11px] text-muted-foreground text-right tabular-nums">{notes.length}/280</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={handleBacklog} disabled={!course}>
            Ajouter au backlog
          </Button>
          <Button className="flex-1" onClick={handlePlanify} disabled={!course}>
            Planifier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
