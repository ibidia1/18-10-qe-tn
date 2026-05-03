import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { CalendarEvent } from "../data/types";
import { getSeriesByCourse } from "../data/series";
import { estimateDurationMinutes } from "../hooks/useEstimation";
import { minutesToDisplay } from "../lib/dateUtils";
import { eventColors } from "../lib/colors";

interface Props {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
  onLaunch: (event: CalendarEvent, type: "qcm" | "lecture", seriesId?: string) => void;
}

export function ExecuteTaskDialog({ event, open, onClose, onLaunch }: Props) {
  const [type, setType] = useState<"qcm" | "lecture">("qcm");
  const [seriesId, setSeriesId] = useState<string | null>(null);

  if (!event) return null;

  const series = getSeriesByCourse(event.courseId);
  const selectedSeries = series.find((s) => s.id === seriesId);
  const est = selectedSeries ? estimateDurationMinutes(selectedSeries.numberOfQuestions) : null;

  function handleLaunch() {
    if (!event) return;
    onLaunch(event, type, seriesId ?? undefined);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight">
            🔁 Executer la revision
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{event.title}</p>
            {event.revisionInterval && (
              <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-0.5">
                Intervalle {event.revisionInterval}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</p>
            <div className="flex gap-2">
              {(["qcm", "lecture"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setType(t); setSeriesId(null); }}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    type === t
                      ? `${eventColors[t].badge}`
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {eventColors[t].icon} {t === "qcm" ? "QCM" : "Lecture"}
                </button>
              ))}
            </div>
          </div>

          {/* Series picker (QCM only) */}
          {type === "qcm" && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Choisir une serie (non faites en premier)
              </p>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                {series.map((s) => {
                  const isSelected = seriesId === s.id;
                  const estMin = estimateDurationMinutes(s.numberOfQuestions);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSeriesId(isSelected ? null : s.id)}
                      className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                        isSelected ? "bg-primary/10" : "hover:bg-muted/60"
                      } ${
                        s.userStatus === "done" ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">
                          ★ {s.rating.toFixed(1)} · {s.year} {s.faculty}
                        </p>
                        <p className="text-[11px] text-muted-foreground tabular-nums">
                          {s.numberOfQuestions}Q
                          {estMin !== null ? ` · ~${minutesToDisplay(estMin)}` : ""}
                          {s.userStatus === "done" ? " · Deja faite" : ""}
                          {s.userStatus === "partial" ? " · Partielle" : ""}
                        </p>
                      </div>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {est !== null && (
            <p className="text-[11px] text-muted-foreground tabular-nums">
              Duree estimee : ~{minutesToDisplay(est)}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuler
          </Button>
          <Button className="flex-1" onClick={handleLaunch}>
            Lancer ►
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
