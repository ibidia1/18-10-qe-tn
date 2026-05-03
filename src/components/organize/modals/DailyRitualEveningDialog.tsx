import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Progress } from "../../ui/progress";
import type { CalendarEvent } from "../data/types";
import { todayISO, minutesToDisplay } from "../lib/dateUtils";

interface Props {
  open: boolean;
  events: CalendarEvent[];
  onClose: () => void;
  onPostpone: (eventId: string) => void;
}

export function DailyRitualEveningDialog({ open, events, onClose, onPostpone }: Props) {
  const [rating, setRating] = useState(0);
  const today = todayISO();

  const todayEvents = events.filter((e) => e.startDate === today);
  const doneEvents = todayEvents.filter((e) => e.status === "done");
  const pendingEvents = todayEvents.filter((e) => e.status === "upcoming");

  const pct = todayEvents.length > 0
    ? Math.round((doneEvents.length / todayEvents.length) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight">
            Bilan de ta journee 🌙
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                Tu as accompli {doneEvents.length} / {todayEvents.length} taches aujourd'hui.
              </p>
              <span className="text-sm font-bold tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>

          {/* Done tasks */}
          {doneEvents.length > 0 && (
            <div className="space-y-1.5">
              {doneEvents.map((evt) => (
                <div key={evt.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="truncate text-emerald-700 dark:text-emerald-400">{evt.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pending tasks */}
          {pendingEvents.length > 0 && (
            <div className="space-y-1.5">
              {pendingEvents.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm min-w-0">
                    <span className="text-muted-foreground">⏭️</span>
                    <span className="truncate text-muted-foreground">{evt.title}</span>
                  </div>
                  <button
                    onClick={() => onPostpone(evt.id)}
                    className="text-[11px] text-orange-600 hover:underline flex-shrink-0"
                  >
                    Reporter a demain
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Star rating */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Note ta journee
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= rating ? "text-amber-400" : "text-muted-foreground/30"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>Terminer la journee ➜</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
