import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import type { AutoModeConfig as Config } from "../data/types";

interface Props {
  config: Config;
  onUpdate: (config: Config) => void;
  generatedCount: number;
}

export function AutoModeConfigPanel({ config, onUpdate, generatedCount }: Props) {
  const [newInterval, setNewInterval] = useState("");

  function addInterval() {
    const n = parseInt(newInterval, 10);
    if (!isNaN(n) && n > 0 && !config.intervals.includes(n)) {
      onUpdate({ ...config, intervals: [...config.intervals, n].sort((a, b) => a - b), customMode: true });
      setNewInterval("");
    }
  }

  function removeInterval(val: number) {
    onUpdate({ ...config, intervals: config.intervals.filter((v) => v !== val), customMode: true });
  }

  return (
    <Card className="bg-gradient-to-br from-card to-primary/[0.03] dark:to-primary/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center justify-between">
          <span>Mode automatique</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={(v) => onUpdate({ ...config, enabled: v })}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <p className="text-xs text-muted-foreground">
          Quand tu termines un QCM ou une lecture, des revisions sont automatiquement planifiees.
        </p>

        {/* Interval pills */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Intervalles de revision</p>
          <div className="flex flex-wrap gap-1.5">
            {config.intervals.map((days) => (
              <div key={days} className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                <span className="tabular-nums">J+{days}</span>
                <button
                  onClick={() => removeInterval(days)}
                  className="text-primary/60 hover:text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add interval */}
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="number"
              min="1"
              placeholder="J+?"
              value={newInterval}
              onChange={(e) => setNewInterval(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addInterval()}
              className="h-7 text-xs w-20"
            />
            <Button size="sm" variant="outline" onClick={addInterval} className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Ajouter
            </Button>
          </div>
        </div>

        {/* Preferred hour */}
        <div>
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Heure preferee</Label>
          <input
            type="time"
            value={config.preferredHour}
            onChange={(e) => onUpdate({ ...config, preferredHour: e.target.value })}
            className="mt-1 h-7 w-full rounded-md border border-input bg-background px-2 text-sm"
          />
        </div>

        {generatedCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {generatedCount} revision(s) generee(s) cette semaine.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
