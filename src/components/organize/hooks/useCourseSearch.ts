import { useState, useMemo } from "react";
import { COURSES } from "../data/courses";
import type { Course } from "../data/types";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function scoreMatch(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);
  if (!t) return 0;
  if (t === q) return 1;
  if (t.startsWith(q)) return 0.95;
  if (t.includes(q)) return 0.85;
  // bigram overlap
  let matches = 0;
  for (let i = 0; i < q.length - 1; i++) {
    if (t.includes(q.slice(i, i + 2))) matches++;
  }
  return (matches / Math.max(1, q.length - 1)) * 0.7;
}

export function searchCourses(query: string, limit = 12): Course[] {
  if (!query.trim()) return COURSES.slice(0, limit);
  const trimmed = query.trim();
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    const exact = COURSES.filter((c) => c.number === num);
    if (exact.length > 0) return exact.slice(0, limit);
  }
  return COURSES
    .map((c) => ({
      course: c,
      score: Math.max(
        scoreMatch(trimmed, c.title),
        scoreMatch(trimmed, c.shortTitle ?? ""),
        scoreMatch(trimmed, String(c.number)),
        scoreMatch(trimmed, c.specialty)
      ),
    }))
    .filter((x) => x.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.course);
}

export function useCourseSearch(defaultLimit = 6) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCourses(query, defaultLimit), [query, defaultLimit]);
  return { query, setQuery, results };
}
