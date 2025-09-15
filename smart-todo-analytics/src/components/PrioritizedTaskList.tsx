"use client";
import { useTasks } from "@/hooks/useTasks";
import dayjs from "dayjs";

/**
 * We normalise the tasks here to make sure score is a number
 * and Firestore Timestamps are converted to JS Date.
 */
export default function PrioritizedTaskList() {
  const { prioritizedTasks } = useTasks();

  // convert each task's dueAt + importance to usable values
  const normalized = prioritizedTasks.map((t) => {
    // Firestore Timestamp → JS Date
    const dueDate =
      t.dueAt && typeof (t.dueAt as any).toDate === "function"
        ? (t.dueAt as any).toDate()
        : t.dueAt;

    // map importance string to numeric score
    let importanceValue = 1;
    if (typeof t.importance === "string") {
      const imp = t.importance.toLowerCase();
      if (imp.includes("high")) importanceValue = 10;
      else if (imp.includes("medium")) importanceValue = 5;
      else if (imp.includes("low")) importanceValue = 2;
    } else {
      importanceValue = Number(t.importance) || 1;
    }

    // compute scores
    const importanceScore = importanceValue * 5;
    let dueScore = 0;
    if (dueDate) {
      const daysUntil = dayjs(dueDate).diff(dayjs(), "day");
      dueScore = daysUntil <= 0 ? 50 : Math.max(0, 30 - daysUntil);
    }

    return {
      ...t,
      dueAt: dueDate,
      score: importanceScore + dueScore,
    };
  });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold mb-2">Recommended Order</h2>
      {normalized.map((t) => (
        <div
          key={t.id}
          className="p-4 bg-gray-900 text-white rounded-xl shadow-md flex justify-between"
        >
          <div>
            <div className="font-semibold">{t.title}</div>
            {t.description && (
              <div className="text-sm text-gray-400">{t.description}</div>
            )}
            <div className="text-xs text-gray-400">
              Importance: {t.importance}{" "}
              {t.dueAt && `| Due: ${dayjs(t.dueAt).format("DD MMM")}`}
            </div>
          </div>
          <div className="text-sm font-semibold text-indigo-400">
            Score: {t.score.toFixed(0)}
          </div>
        </div>
      ))}
    </div>
  );
}
