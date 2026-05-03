import { useEffect, useState } from "react";
import { todayISO } from "../lib/dateUtils";

export function useDailyRitual(
  lastMorning: string | null,
  lastEvening: string | null
) {
  const [showMorning, setShowMorning] = useState(false);
  const [showEvening, setShowEvening] = useState(false);

  useEffect(() => {
    const today = todayISO();
    const hour = new Date().getHours();
    if (lastMorning !== today) setShowMorning(true);
    if (hour >= 18 && lastEvening !== today) setShowEvening(true);
  }, [lastMorning, lastEvening]);

  return {
    showMorning,
    showEvening,
    dismissMorning: () => setShowMorning(false),
    dismissEvening: () => setShowEvening(false),
  };
}
