import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { COURSES } from "../data/courses";
import type { CalendarEvent } from "../data/types";
import { todayISO } from "../lib/dateUtils";

interface Props {
  examDate: string;
  events: CalendarEvent[];
}

const STATUS_DOT: Record<string, string> = {
  completed: "bg-emerald-500",
  in_progress: "bg-amber-500",
  not_started: "bg-muted-foreground/30",
};

export function MacroPlanView({ examDate, events }: Props) {
  const today = new Date();
  const exam = new Date(examDate);
  const totalWeeks = Math.max(1, Math.ceil((exam.getTime() - today.getTime()) / (7 * 24 * 3600 * 1000)));
  const coursesPerWeek = Math.ceil(75 / totalWeeks);

  const completedCount = COURSES.filter((c) => c.status === "completed").length;
  const inProgressCount = COURSES.filter((c) => c.status === "in_progress").length;

  // Distribute courses across weeks
  const weeks = useMemo(() => {
    const result: Array<{ weekStart: Date; courses: typeof COURSES }> = [];
    for (let w = 0; w < Math.min(totalWeeks, 20); w++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() + w * 7);
      const start = w * coursesPerWeek;
      const end = Math.min(start + coursesPerWeek, 75);
      result.push({ weekStart, courses: COURSES.slice(start, end) });
    }
    return result;
  }, [totalWeeks, coursesPerWeek]);

  return (
    <Card className="bg-gradient-to-br from-card to-primary/[0.03] dark:to-primary/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight">Plan Macro — {totalWeeks} semaines</CardTitle>
        <p className="text-[11px] text-muted-foreground">
          {completedCount}/75 cours termines · {totalWeeks} semaines restantes · Rythme : ~{coursesPerWeek} cours/semaine
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-2" style={{ minWidth: `${weeks.length * 140}px` }}>
            {weeks.map(({ weekStart, courses: wCourses }, wi) => (
              <div key={wi} className="flex-shrink-0 w-32">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  S{wi + 1} · {weekStart.getDate()}/{weekStart.getMonth() + 1}
                </p>
                <div className="space-y-1">
                  {wCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-1 text-[10px] p-1 rounded bg-muted/30 hover:bg-muted/60 transition-colors"
                      title={course.title}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[course.status]}`} />
                      <span className="truncate">{course.shortTitle ?? course.title.split(" ").slice(0, 3).join(" ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[11px] text-muted-foreground">
          {[
            { label: "Termine", dot: "bg-emerald-500" },
            { label: "En cours", dot: "bg-amber-500" },
            { label: "A faire", dot: "bg-muted-foreground/30" },
          ].map(({ label, dot }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${dot}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
