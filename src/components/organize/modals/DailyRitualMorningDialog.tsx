import React from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { CalendarEvent } from "../data/types";
import { eventColors } from "../lib/colors";
import { minutesToDisplay, todayISO } from "../lib/dateUtils";

interface Props {
  open: boolean;
  events: CalendarEvent[];
  onClose: () => void;
  onPostpone: (eventId: string) => void;
}

const FR_DAYS = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const FR_MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

export function DailyRitualMorningDialog({ open, events, onClose, onPostpone }: Props) {
  const today = todayISO();
  const todayEvents = events
    .filter((e) => e.startDate === today && e.status === "upcoming")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalMin = todayEvents.reduce((s, e) => s + e.durationMinutes, 0);
  const d = new Date();
  const dateLabel = `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]}`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight">
            Bonjour Dr. Sarah 👋
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Voici ton plan pour aujourd'hui ({dateLabel}) :
          </p>

          {todayEvents.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Aucune tache planifiee aujourd'hui. C'est l'occasion d'en ajouter une !
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((evt) => {
                const colors = eventColors[evt.type];
                return (
                  <div
                    key={evt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-l-2 ${colors.border} ${colors.bg}`}
                  >
                    <span className="text-lg">{colors.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{evt.title}</p>
                      <p className="text-[11px] text-muted-foreground tabular-nums">
                        {evt.startTime} · ~{minutesToDisplay(evt.durationMinutes)}
                      </p>
                    </div>
                    <button
                      onClick={() => onPostpone(evt.id)}
                      className="text-[11px] text-muted-foreground hover:text-orange-600 transition-colors flex-shrink-0"
                      title="Reporter a demain"
                    >
                      Reporter
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {totalMin > 0 && (
            <p className="text-sm font-medium text-center">
              Total : <strong className="tabular-nums">{minutesToDisplay(totalMin)}</strong> de travail planifie.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>C'est parti ➜</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
