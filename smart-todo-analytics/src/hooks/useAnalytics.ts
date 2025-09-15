// src/hooks/useAnalytics.ts
"use client";
import { useTasks } from "./useTasks";
import { useMemo } from "react";
import dayjs from "dayjs";

export function useAnalytics() {
  const { tasks } = useTasks();

  return useMemo(() => {
    const completed = tasks.filter((t) => t.completed && t.completedAt);

    // 1. Completed per day
    const byDate: Record<string, any[]> = {};
    completed.forEach((t) => {
      const d = dayjs(t.completedAt).format("YYYY-MM-DD");
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(t);
    });
    const perDay = Object.entries(byDate).map(([date, list]) => ({
      date,
      count: list.length,
      tasks: list,
    }));

    // 2. By day of week
    const byDOW: Record<string, number[]> = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };
    completed.forEach((t) => {
      const dayName = dayjs(t.completedAt).format("dddd");
      byDOW[dayName].push(1);
    });
    const perDOW = Object.entries(byDOW).map(([day, arr]) => ({
      day,
      avg: arr.length,
    }));

    // 3. By hour-of-day (power hours)
    const byHour: Record<number, number> = {};
    completed.forEach((t) => {
      const hour = dayjs(t.completedAt).hour();
      byHour[hour] = (byHour[hour] || 0) + 1;
    });
    const perHour = Object.entries(byHour).map(([h, c]) => ({
      hour: `${h}:00`,
      count: c,
    }));

    // Stats
    let totalDuration = 0;
    let countDuration = 0;
    completed.forEach((t) => {
      if (t.createdAt && t.completedAt) {
        const days = dayjs(t.completedAt).diff(dayjs(t.createdAt), "hour") / 24;
        totalDuration += days;
        countDuration++;
      }
    });
    const avgCompletionDays = countDuration ? totalDuration / countDuration : 0;

    let late = 0;
    let onTime = 0;
    completed.forEach((t) => {
      if (t.dueAt) {
        if (dayjs(t.completedAt).isAfter(dayjs(t.dueAt))) late++;
        else onTime++;
      }
    });
    const procrastinationScore =
      late + onTime > 0 ? Math.round((late / (late + onTime)) * 100) : 0;

    // compute completion velocity (days between createdAt & completedAt)
const velocityBuckets: Record<string, number> = {};
completed.forEach((t) => {
  if (t.createdAt && t.completedAt) {
    const days = dayjs(t.completedAt).diff(dayjs(t.createdAt), "day");
    // we bucket days into 0,1,2,3,4,5+ etc
    const bucket = days > 5 ? "5+" : days.toString();
    velocityBuckets[bucket] = (velocityBuckets[bucket] || 0) + 1;
  }
});
const completionVelocity = Object.entries(velocityBuckets)
  .map(([days, count]) => ({
    days: days === "0" ? "same day" : days === "5+" ? "≥5 days" : `${days} days`,
    count,
  }))
  .sort((a, b) => {
    // keep order: same day,1,2,3,4,≥5
    const order = (label: string) =>
      label === "same day" ? 0 : label.startsWith("≥") ? 6 : parseInt(label);
    return order(a.days) - order(b.days);
  });


    return {
  perDay,
  perDOW,
  perHour,
  avgCompletionDays,
  procrastinationScore,
  totalCompleted: completed.length,
  completionVelocity, // <— new
};

  }, [tasks]);
}
