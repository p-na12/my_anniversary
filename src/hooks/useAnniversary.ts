import { useEffect, useMemo, useState } from "react";

export function useAnniversary(startDate: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`).getTime();
    const totalSeconds = Math.max(0, Math.floor((now - start) / 1000));
    const totalDays = Math.floor(totalSeconds / 86400);
    let remainder = totalSeconds;
    const years = Math.floor(remainder / 31557600); remainder %= 31557600;
    const months = Math.floor(remainder / 2629800); remainder %= 2629800;
    const days = Math.floor(remainder / 86400); remainder %= 86400;
    const hours = Math.floor(remainder / 3600); remainder %= 3600;
    const minutes = Math.floor(remainder / 60);
    const seconds = remainder % 60;
    return { years, months, days, hours, minutes, seconds, totalDays };
  }, [now, startDate]);
}