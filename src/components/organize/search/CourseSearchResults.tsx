import React from "react";
import type { Course } from "../data/types";
import { SERIES } from "../data/series";
import { COURSES } from "../data/courses";

interface Props {
  courses: Course[];
  query: string;
  selectedIndex: number;
  onSelect: (course: Course) => void;
}

function StatusDot({ status }: { status: Course["status"] }) {
  if (status === "completed") return <span className="text-emerald-500">●</span>;
  if (status === "in_progress") return <span className="text-amber-500">●</span>;
  return <span className="text-muted-foreground/40">○</span>;
}

export function CourseSearchResults({ courses, query, selectedIndex, onSelect }: Props) {
  if (!query && courses.length === 0) return null;
  if (courses.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        Aucun cours trouvé pour "{query}"
      </div>
    );
  }

  return (
    <div className="py-2">
      {courses.map((course, i) => {
        const seriesForCourse = SERIES.filter((s) => s.courseId === course.id);
        const doneSeries = seriesForCourse.filter((s) => s.userStatus === "done").length;
        const totalSeries = seriesForCourse.length;
        const isSelected = i === selectedIndex;

        return (
          <button
            key={course.id}
            onClick={() => onSelect(course)}
            className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors ${
              isSelected ? "bg-primary/10 text-foreground" : "hover:bg-muted/60"
            }`}
          >
            <span className="font-mono text-[11px] text-muted-foreground w-8 tabular-nums flex-shrink-0">
              #{course.number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{course.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {course.specialty} · {course.day}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <StatusDot status={course.status} />
              {totalSeries > 0 && (
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {doneSeries}/{totalSeries} series
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
