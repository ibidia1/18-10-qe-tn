import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { PLAN_TEMPLATES } from "../lib/spacedRepetitionAlgo";
import type { CalendarEvent } from "../data/types";
import { COURSES } from "../data/courses";
import { todayISO, addDays } from "../lib/dateUtils";

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (events: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">[]) => void;
}

function generateTemplateEvents(
  templateId: string
): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">[] {
  const tpl = PLAN_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl) return [];

  const events: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">[] = [];
  const today = todayISO();
  const times = ["09:00", "10:30", "14:00", "15:30", "17:00"];
  let dayOffset = 0;

  for (let week = 0; week < tpl.durationWeeks; week++) {
    const weekBase = week * 7;

    // Lectures
    for (let l = 0; l < tpl.weeklyDistribution.lectures; l++) {
      const courseIdx = (week * tpl.weeklyDistribution.lectures + l) % 75;
      const course = COURSES[courseIdx];
      events.push({
        type: "lecture",
        courseId: course.id,
        title: `📖 Lecture ${course.shortTitle ?? course.title.split(" ").slice(0, 3).join(" ")}`,
        startDate: addDays(today, weekBase + (l % 6)),
        startTime: times[l % times.length],
        durationMinutes: 45,
        estimatedFromKpi: false,
        isRevision: false,
        status: "upcoming",
      });
    }

    // QCM series
    for (let q = 0; q < tpl.weeklyDistribution.qcmSeries; q++) {
      const courseIdx = (week * tpl.weeklyDistribution.qcmSeries + q) % 75;
      const course = COURSES[courseIdx];
      events.push({
        type: "qcm",
        courseId: course.id,
        title: `✍️ QCM ${course.shortTitle ?? course.title.split(" ").slice(0, 3).join(" ")}`,
        startDate: addDays(today, weekBase + (q % 6)),
        startTime: times[(q + 1) % times.length],
        durationMinutes: 20,
        estimatedFromKpi: true,
        isRevision: false,
        status: "upcoming",
      });
    }

    // Revisions
    for (let r = 0; r < tpl.weeklyDistribution.revisions; r++) {
      const courseIdx = (week * tpl.weeklyDistribution.revisions + r) % 75;
      const course = COURSES[courseIdx];
      events.push({
        type: "revision_slot",
        courseId: course.id,
        title: `🔁 Revision ${course.shortTitle ?? course.title.split(" ").slice(0, 3).join(" ")}`,
        startDate: addDays(today, weekBase + (r % 6)),
        startTime: times[(r + 2) % times.length],
        durationMinutes: 20,
        estimatedFromKpi: true,
        isRevision: true,
        status: "upcoming",
      });
    }
  }

  return events.slice(0, 200); // cap for demo
}

export function TemplateLibraryDialog({ open, onClose, onApply }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleApply() {
    if (!selected) return;
    setConfirming(true);
  }

  function confirmApply() {
    if (!selected) return;
    const evts = generateTemplateEvents(selected);
    onApply(evts);
    setConfirming(false);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold tracking-tight">
              Bibliotheque de templates
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {PLAN_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelected(tpl.id === selected ? null : tpl.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selected === tpl.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold">{tpl.name}</p>
                  <Badge className="text-[10px] h-5 border-border bg-muted text-muted-foreground flex-shrink-0">
                    {tpl.durationWeeks} semaines
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{tpl.description}</p>
                <div className="flex gap-3 text-[11px] text-muted-foreground">
                  <span>📖 {tpl.weeklyDistribution.lectures} lectures/sem</span>
                  <span>✍️ {tpl.weeklyDistribution.qcmSeries} QCM/sem</span>
                  <span>🔁 {tpl.weeklyDistribution.revisions} revisions/sem</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button className="flex-1" onClick={handleApply} disabled={!selected}>
              Appliquer ce template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Appliquer le template ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cela va ajouter de nombreux evenements a ton planning. Les evenements existants seront conserves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApply}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
