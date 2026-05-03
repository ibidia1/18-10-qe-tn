import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import type { CalendarEvent } from "../data/types";
import { calculateStreak, calculateBestStreak } from "../lib/spacedRepetitionAlgo";

interface Props {
  events: CalendarEvent[];
}

const INTENSITY_CLASSES = [
  "bg-muted/30 dark:bg-muted/20",       // 0 events
  "bg-emerald-200 dark:bg-emerald-900",  // 1-2
  "bg-emerald-400 dark:bg-emerald-700",  // 3-5
  "bg-emerald-500 dark:bg-emerald-600",  // 6-9
  "bg-emerald-600 dark:bg-emerald-500",  // 10+
];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export function RevisionHeatmap({ events }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const streak = calculateStreak(events);
  const bestStreak = calculateBestStreak(events);

  const { cells, monthPositions } = useMemo(() => {
    // Build 52 weeks x 7 days grid ending today
    const doneCounts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.status === "done" && e.completedAt) {
        const d = e.completedAt.slice(0, 10);
        doneCounts[d] = (doneCounts[d] ?? 0) + 1;
      }
    });

    const today = new Date();
    const todayDay = (today.getDay() + 6) % 7; // Mon = 0
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364 - todayDay); // Start 52 weeks + offset back

    const cells: Array<{ date: string; count: number; weekIdx: number; dayIdx: number }> = [];
    const monthPositions: Array<{ label: string; weekIdx: number }> = [];
    let lastMonth = -1;

    for (let week = 0; week < 53; week++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + week * 7 + day);
        if (d > today) continue;
        const dateStr = d.toISOString().slice(0, 10);
        const m = d.getMonth();
        if (m !== lastMonth) {
          monthPositions.push({ label: MONTH_LABELS[m], weekIdx: week });
          lastMonth = m;
        }
        cells.push({ date: dateStr, count: doneCounts[dateStr] ?? 0, weekIdx: week, dayIdx: day });
      }
    }
    return { cells, monthPositions };
  }, [events]);

  const maxWeek = Math.max(...cells.map((c) => c.weekIdx), 0);

  return (
    <Card className="bg-gradient-to-br from-card to-primary/[0.03] dark:to-primary/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center justify-between">
          <span>Ma regularite</span>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-normal">
            <span>Serie actuelle : <strong className="text-foreground tabular-nums">{streak}j</strong></span>
            <span>Meilleure serie : <strong className="text-foreground tabular-nums">{bestStreak}j</strong></span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <div className="relative">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: "20px" }}>
            {monthPositions.map((mp) => (
              <div
                key={`${mp.label}-${mp.weekIdx}`}
                className="text-[10px] text-muted-foreground absolute"
                style={{ left: `${20 + mp.weekIdx * 13}px` }}
              >
                {mp.label}
              </div>
            ))}
          </div>

          <div className="flex mt-5">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-1">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="text-[10px] text-muted-foreground" style={{ height: "11px", lineHeight: "11px" }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div
              className="relative"
              style={{ width: `${(maxWeek + 1) * 13}px`, height: `${7 * 13}px` }}
            >
              {cells.map((cell) => (
                <div
                  key={cell.date}
                  className={`absolute rounded-[2px] cursor-pointer ${INTENSITY_CLASSES[getIntensity(cell.count)]}`}
                  style={{
                    width: "11px",
                    height: "11px",
                    left: `${cell.weekIdx * 13}px`,
                    top: `${cell.dayIdx * 13}px`,
                  }}
                  onMouseEnter={(e) => setTooltip({ date: cell.date, count: cell.count, x: (e.currentTarget as HTMLElement).offsetLeft, y: (e.currentTarget as HTMLElement).offsetTop })}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))}

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="absolute z-10 bg-popover border border-border rounded px-2 py-1 text-[11px] shadow-md pointer-events-none whitespace-nowrap"
                  style={{ left: tooltip.x + 14, top: tooltip.y - 4 }}
                >
                  <strong>{tooltip.date}</strong> — {tooltip.count} tache(s) faite(s)
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
