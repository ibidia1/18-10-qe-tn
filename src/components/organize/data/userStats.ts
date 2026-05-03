import type { UserStats } from "./types";

// Toggle this to false to test the "KPI absent" scenario
const KPI_ENABLED = true;

export const MOCK_USER_STATS: UserStats = {
  avgTimePerQcmSimple: KPI_ENABLED ? 38 : null,
  avgTimePerQcmCase: KPI_ENABLED ? 95 : null,
  avgReadingSpeedWpm: null,
  totalQcmDone: 1247,
  totalLecturesRead: 23,
};
