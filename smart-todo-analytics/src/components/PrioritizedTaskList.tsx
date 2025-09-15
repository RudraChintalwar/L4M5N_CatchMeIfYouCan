// src/components/PrioritizedTaskList.tsx
"use client";
import { useTasks } from "@/hooks/useTasks";
import dayjs from "dayjs";
import { motion } from "framer-motion";

export default function PrioritizedTaskList() {
  const { prioritizedTasks } = useTasks();

  const normalized = prioritizedTasks.map((t) => {
    const dueDate =
      t.dueAt && typeof (t.dueAt as any).toDate === "function"
        ? (t.dueAt as any).toDate()
        : t.dueAt;

    let importanceValue = 1;
    if (typeof t.importance === "string") {
      const imp = t.importance.toLowerCase();
      if (imp.includes("high")) importanceValue = 10;
      else if (imp.includes("medium")) importanceValue = 5;
      else if (imp.includes("low")) importanceValue = 2;
    } else {
      importanceValue = Number(t.importance) || 1;
    }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Recommended Order</h2>
      {normalized.map((t, index) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="p-5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl shadow-lg border border-purple-700/30 flex justify-between items-center backdrop-blur-sm"
        >
          <div className="flex-1">
            <div className="font-semibold text-white text-lg">{t.title}</div>
            {t.description && (
              <div className="text-sm text-purple-200 mt-1">{t.description}</div>
            )}
            <div className="text-xs text-purple-300 mt-2">
              Importance: {t.importance}{" "}
              {t.dueAt && `| Due: ${dayjs(t.dueAt).format("DD MMM")}`}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Score: {t.score.toFixed(0)}
            </div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}