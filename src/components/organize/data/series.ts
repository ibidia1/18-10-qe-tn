import type { Series } from "./types";

type Faculty = "Tunis" | "Sfax" | "Sousse" | "Monastir";

function makeSeries(
  courseId: number,
  entries: Array<{
    year: number;
    faculty: Faculty;
    nq: number;
    rating: number;
    votes: number;
    status: "not_done" | "partial" | "done";
    score?: number;
  }>
): Series[] {
  return entries.map(({ year, faculty, nq, rating, votes, status, score }) => ({
    id: `${year}-${faculty.toLowerCase()}-c${courseId}`,
    courseId,
    year,
    faculty,
    numberOfQuestions: nq,
    rating,
    votes,
    userStatus: status,
    userScore: score,
  }));
}

export const SERIES: Series[] = [
  ...makeSeries(1, [
    { year: 2024, faculty: "Tunis", nq: 25, rating: 9.2, votes: 134, status: "done", score: 88 },
    { year: 2024, faculty: "Sfax", nq: 28, rating: 8.8, votes: 97, status: "done", score: 76 },
    { year: 2023, faculty: "Tunis", nq: 25, rating: 8.5, votes: 112, status: "partial", score: 64 },
    { year: 2023, faculty: "Sousse", nq: 22, rating: 7.9, votes: 89, status: "not_done" },
    { year: 2022, faculty: "Tunis", nq: 20, rating: 8.1, votes: 78, status: "not_done" },
    { year: 2022, faculty: "Monastir", nq: 18, rating: 7.2, votes: 54, status: "not_done" },
    { year: 2021, faculty: "Sfax", nq: 24, rating: 8.4, votes: 65, status: "not_done" },
    { year: 2020, faculty: "Tunis", nq: 22, rating: 7.8, votes: 43, status: "not_done" },
    { year: 2019, faculty: "Sousse", nq: 20, rating: 6.9, votes: 38, status: "not_done" },
  ]),
  ...makeSeries(2, [
    { year: 2024, faculty: "Tunis", nq: 22, rating: 8.7, votes: 98, status: "done", score: 82 },
    { year: 2024, faculty: "Sousse", nq: 20, rating: 8.2, votes: 76, status: "not_done" },
    { year: 2023, faculty: "Sfax", nq: 25, rating: 8.0, votes: 88, status: "not_done" },
    { year: 2022, faculty: "Tunis", nq: 18, rating: 7.5, votes: 61, status: "not_done" },
    { year: 2021, faculty: "Monastir", nq: 20, rating: 7.1, votes: 49, status: "not_done" },
    { year: 2020, faculty: "Sfax", nq: 22, rating: 6.8, votes: 35, status: "not_done" },
    { year: 2019, faculty: "Tunis", nq: 18, rating: 7.3, votes: 42, status: "not_done" },
    { year: 2019, faculty: "Sousse", nq: 15, rating: 6.5, votes: 28, status: "not_done" },
  ]),
  ...makeSeries(3, [
    { year: 2024, faculty: "Tunis", nq: 28, rating: 9.0, votes: 145, status: "done", score: 91 },
    { year: 2024, faculty: "Sousse", nq: 24, rating: 8.6, votes: 110, status: "done", score: 85 },
    { year: 2023, faculty: "Sfax", nq: 26, rating: 8.3, votes: 99, status: "partial", score: 72 },
    { year: 2023, faculty: "Monastir", nq: 22, rating: 7.8, votes: 67, status: "not_done" },
    { year: 2022, faculty: "Tunis", nq: 24, rating: 8.0, votes: 82, status: "not_done" },
    { year: 2021, faculty: "Sfax", nq: 20, rating: 7.4, votes: 59, status: "not_done" },
    { year: 2020, faculty: "Sousse", nq: 18, rating: 6.9, votes: 41, status: "not_done" },
    { year: 2019, faculty: "Tunis", nq: 22, rating: 7.1, votes: 48, status: "not_done" },
    { year: 2019, faculty: "Monastir", nq: 16, rating: 6.4, votes: 29, status: "not_done" },
  ]),
  ...makeSeries(4, [
    { year: 2024, faculty: "Tunis", nq: 20, rating: 8.5, votes: 88, status: "not_done" },
    { year: 2024, faculty: "Sfax", nq: 18, rating: 8.0, votes: 72, status: "not_done" },
    { year: 2023, faculty: "Sousse", nq: 22, rating: 7.7, votes: 64, status: "not_done" },
    { year: 2022, faculty: "Tunis", nq: 20, rating: 7.5, votes: 55, status: "not_done" },
    { year: 2021, faculty: "Monastir", nq: 16, rating: 7.0, votes: 40, status: "not_done" },
    { year: 2020, faculty: "Sfax", nq: 18, rating: 6.8, votes: 33, status: "not_done" },
    { year: 2019, faculty: "Tunis", nq: 15, rating: 6.5, votes: 27, status: "not_done" },
    { year: 2019, faculty: "Sousse", nq: 17, rating: 6.3, votes: 22, status: "not_done" },
  ]),
  ...makeSeries(5, [
    { year: 2024, faculty: "Tunis", nq: 22, rating: 8.9, votes: 103, status: "done", score: 80 },
    { year: 2024, faculty: "Sfax", nq: 20, rating: 8.3, votes: 79, status: "not_done" },
    { year: 2023, faculty: "Sousse", nq: 18, rating: 7.9, votes: 68, status: "not_done" },
    { year: 2022, faculty: "Tunis", nq: 22, rating: 7.6, votes: 58, status: "not_done" },
    { year: 2021, faculty: "Monastir", nq: 18, rating: 7.2, votes: 45, status: "not_done" },
    { year: 2020, faculty: "Sfax", nq: 20, rating: 6.9, votes: 36, status: "not_done" },
    { year: 2019, faculty: "Tunis", nq: 16, rating: 7.0, votes: 32, status: "not_done" },
    { year: 2019, faculty: "Sousse", nq: 15, rating: 6.2, votes: 20, status: "not_done" },
    { year: 2019, faculty: "Monastir", nq: 14, rating: 5.8, votes: 17, status: "not_done" },
  ]),
];

// Generate series for courses 6-75 with varied data
const faculties: Faculty[] = ["Tunis", "Sfax", "Sousse", "Monastir"];
const years = [2019, 2020, 2021, 2022, 2023, 2024];

for (let courseId = 6; courseId <= 75; courseId++) {
  const numSeries = 8 + Math.floor(Math.random() * 5); // 8-12 series
  const entries: Series[] = [];
  const usedCombos = new Set<string>();

  let count = 0;
  let yearIdx = years.length - 1;
  let facultyIdx = 0;

  while (count < numSeries) {
    const year = years[yearIdx];
    const faculty = faculties[facultyIdx % faculties.length];
    const key = `${year}-${faculty}`;

    if (!usedCombos.has(key)) {
      usedCombos.add(key);
      const rand = Math.random();
      const status: "not_done" | "partial" | "done" =
        rand < 0.3 ? "done" : rand < 0.4 ? "partial" : "not_done";
      const rating = Math.round((5.5 + Math.random() * 3.7) * 10) / 10;
      entries.push({
        id: `${year}-${faculty.toLowerCase()}-c${courseId}`,
        courseId,
        year,
        faculty,
        numberOfQuestions: 15 + Math.floor(Math.random() * 16),
        rating,
        votes: 15 + Math.floor(Math.random() * 130),
        userStatus: status,
        userScore: status !== "not_done" ? Math.round(50 + Math.random() * 50) : undefined,
      });
      count++;
    }

    facultyIdx++;
    if (facultyIdx % faculties.length === 0) yearIdx = Math.max(0, yearIdx - 1);
  }

  SERIES.push(...entries);
}

export function getSeriesByCourse(courseId: number): Series[] {
  return SERIES.filter((s) => s.courseId === courseId).sort(
    (a, b) => {
      const statusOrder = { not_done: 0, partial: 1, done: 2 };
      if (statusOrder[a.userStatus] !== statusOrder[b.userStatus])
        return statusOrder[a.userStatus] - statusOrder[b.userStatus];
      return b.rating - a.rating;
    }
  );
}
