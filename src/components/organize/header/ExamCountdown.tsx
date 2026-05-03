import React, { useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { daysUntilExam } from "../data/examDate";
import { formatDateFR } from "../lib/dateUtils";

interface Props {
  examDate: string;
  onSetExamDate: (date: string) => void;
}

export function ExamCountdown({ examDate, onSetExamDate }: Props) {
  const days = daysUntilExam(examDate);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(examDate);

  const isUrgent = days <= 7;

  const badgeClass = isUrgent
    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60"
    : "bg-primary/10 text-primary border-primary/30";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold tabular-nums transition-colors hover:opacity-80 ${badgeClass}`}
        >
          <span>J-{days}</span>
          {isUrgent && <span>🔥</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Date du residanat</p>
            <p className="text-sm font-medium">{formatDateFR(examDate)}</p>
            <p className="text-xs text-muted-foreground">{days} jours restants</p>
          </div>
          {editing ? (
            <div className="space-y-2">
              <Label htmlFor="exam-date-input" className="text-xs">Modifier la date</Label>
              <Input
                id="exam-date-input"
                type="date"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs flex-1" onClick={() => { onSetExamDate(draft); setEditing(false); }}>
                  Enregistrer
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => setEditing(true)}>
              Modifier la date
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
