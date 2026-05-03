import type { EventType } from "../data/types";

export type Tier = "good" | "mid" | "bad";

export const tierStyles: Record<Tier, { badge: string; pill: string; bar: string; row: string }> = {
  good: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    bar: "bg-emerald-500 dark:bg-emerald-400",
    row: "bg-emerald-50/40 dark:bg-emerald-950/10",
  },
  mid: {
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-400",
    pill: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
    bar: "bg-orange-500 dark:bg-orange-400",
    row: "bg-orange-50/40 dark:bg-orange-950/10",
  },
  bad: {
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-400",
    pill: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    bar: "bg-red-500 dark:bg-red-400",
    row: "bg-red-50/40 dark:bg-red-950/10",
  },
};

export const eventColors: Record<EventType, { badge: string; bar: string; border: string; bg: string; icon: string; text: string }> = {
  qcm: {
    badge: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-400",
    bar: "bg-blue-500 dark:bg-blue-400",
    border: "border-l-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "✍️",
    text: "text-blue-700 dark:text-blue-400",
  },
  lecture: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400",
    bar: "bg-emerald-500 dark:bg-emerald-400",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "📖",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  revision_slot: {
    badge: "border-dashed border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-400",
    bar: "bg-amber-500 dark:bg-amber-400",
    border: "border-l-amber-500 border-dashed",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "🔁",
    text: "text-amber-700 dark:text-amber-400",
  },
};

export function getStatusBadge(status: string): string {
  switch (status) {
    case "done": return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400";
    case "rescheduled": return "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-400";
    case "skipped": return "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-400";
    default: return "border-border bg-muted text-muted-foreground";
  }
}
