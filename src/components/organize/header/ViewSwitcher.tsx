import React from "react";

type View = "month" | "week" | "day";

interface Props {
  view: View;
  onChange: (v: View) => void;
}

const VIEWS: { id: View; label: string }[] = [
  { id: "month", label: "Mois" },
  { id: "week", label: "Semaine" },
  { id: "day", label: "Jour" },
];

export function ViewSwitcher({ view, onChange }: Props) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5 text-xs font-medium">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={`px-3 py-1.5 rounded-md transition-all ${
            view === v.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
