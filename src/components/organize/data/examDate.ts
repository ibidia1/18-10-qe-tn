export const DEFAULT_EXAM_DATE = "2026-09-15";
export const EXAM_DATE_STORAGE_KEY = "qe.organize.examDate";

export function getExamDate(): string {
  return localStorage.getItem(EXAM_DATE_STORAGE_KEY) ?? DEFAULT_EXAM_DATE;
}

export function setExamDate(date: string): void {
  localStorage.setItem(EXAM_DATE_STORAGE_KEY, date);
}

export function daysUntilExam(examDate?: string): number {
  const target = new Date(examDate ?? getExamDate());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
