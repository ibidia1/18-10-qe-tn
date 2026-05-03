import React, { useState, useCallback, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { Input } from "../../ui/input";
import { CourseSearchResults } from "./CourseSearchResults";
import { SeriesPickerPopover } from "./SeriesPickerPopover";
import { searchCourses } from "../hooks/useCourseSearch";
import type { Course, CalendarEvent, BacklogItem } from "../data/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onPlanify: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  onBacklog: (item: Omit<BacklogItem, "id" | "createdAt">) => void;
}

export function CourseSearchModal({ open, onClose, onPlanify, onBacklog }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchCourses(query, 12);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedCourse(null);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      setSelectedCourse(results[selectedIndex]);
    } else if (e.key === "Escape") {
      if (selectedCourse) setSelectedCourse(null);
      else onClose();
    }
  }, [results, selectedIndex, selectedCourse, onClose]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl mx-4 animate-in fade-in slide-in-from-top-4 duration-200">
        {selectedCourse ? (
          <SeriesPickerPopover
            course={selectedCourse}
            onPlanify={onPlanify}
            onBacklog={onBacklog}
            onClose={() => { setSelectedCourse(null); }}
          />
        ) : (
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher un cours... (titre, specialite, numero)"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[480px] overflow-y-auto">
              {results.length === 0 && !query ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Tapez un titre, numero ou specialite...
                </div>
              ) : (
                <CourseSearchResults
                  courses={results}
                  query={query}
                  selectedIndex={selectedIndex}
                  onSelect={setSelectedCourse}
                />
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
              <span><kbd className="font-mono">↵</kbd> Selectionner</span>
              <span><kbd className="font-mono">↑↓</kbd> Naviguer</span>
              <span><kbd className="font-mono">Esc</kbd> Fermer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
