const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const FR_DAYS_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const FR_DAYS_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = FR_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateShortFR(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${FR_MONTHS[d.getMonth()].slice(0, 3)}.`;
}

export function formatDayFR(dateStr: string, long = false): string {
  const d = new Date(dateStr);
  const arr = long ? FR_DAYS_LONG : FR_DAYS_SHORT;
  return arr[d.getDay()];
}

export function formatMonthYearFR(date: Date): string {
  return `${FR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function getWeekDates(referenceDate: Date = new Date()): string[] {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0=Sun…6=Sat
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7)); // shift to Monday
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return toISODate(dd);
  });
}

export function getMonthDates(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(firstDayOfWeek).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toISODate(new Date(year, month, d)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isPast(dateStr: string): boolean {
  return dateStr < todayISO();
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayISO();
}

export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `il y a ${days}j`;
  return formatDateShortFR(isoString.slice(0, 10));
}

export function minutesToDisplay(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
