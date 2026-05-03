import React from "react";
import { X, Plus, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import type { BacklogItem, CalendarEvent } from "../data/types";
import { eventColors } from "../lib/colors";
import { COURSES } from "../data/courses";

interface Props {
  backlog: BacklogItem[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
  onPromote: (item: BacklogItem, date: string, time: string) => void;
}

export function BacklogPanel({ backlog, onRemove, onAddClick, onPromote }: Props) {
  return (
    <Card className="bg-gradient-to-br from-card to-primary/[0.03] dark:to-primary/[0.06]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span>A planifier</span>
          </div>
          <div className="flex items-center gap-2">
            {backlog.length > 0 && (
              <Badge className="text-[10px] h-4 tabular-nums border-border bg-muted text-muted-foreground">
                {backlog.length}
              </Badge>
            )}
            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={onAddClick}>
              <Plus className="h-3 w-3 mr-1" /> Ajouter
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {backlog.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Glissez des taches ici ou ajoutez-en une
          </p>
        ) : (
          <div className="space-y-2">
            {backlog.map((item) => {
              const colors = eventColors[item.type];
              const course = COURSES.find((c) => c.id === item.courseId);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("backlogId", item.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border-l-2 ${colors.border} ${colors.bg} cursor-grab group`}
                >
                  <span className="text-sm">{colors.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {course?.shortTitle ?? course?.title ?? `Cours #${item.courseId}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.type === "qcm" ? "QCM" : "Lecture"}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
