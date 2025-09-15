// src/components/AnalyticsDashboard.tsx
"use client";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

export default function AnalyticsDashboard() {
  const {
    perDay,
    perDOW,
    perHour,
    avgCompletionDays,
    procrastinationScore,
    totalCompleted,
    completionVelocity,
  } = useAnalytics();

  const [modalTasks, setModalTasks] = useState<any[] | null>(null);
  const [modalDate, setModalDate] = useState<string>("");

  const statCards = [
    { title: "Average Completion Time", value: `${avgCompletionDays.toFixed(1)} days`, color: "from-blue-500 to-cyan-500" },
    { title: "Procrastination Score", value: `${procrastinationScore}% late`, color: "from-rose-500 to-pink-500" },
    { title: "Total Completed Tasks", value: totalCompleted.toString(), color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-lg text-white`}
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl font-bold drop-shadow-md">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {[
        { title: "Tasks Completed per Day", data: perDay, color: "#6366f1" },
        { title: "Tasks Completed by Day of Week", data: perDOW, color: "#22c55e" },
        { title: "Power Hours (Tasks Completed per Hour)", data: perHour, color: "#f59e0b" },
        { title: "Completion Velocity", data: completionVelocity, color: "#3b82f6" },
      ].map((chart, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            {chart.title}
            {index === 0 && " (click bar for details)"}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chart.data}
              onClick={index === 0 ? (data) => {
                if (data && data.activeLabel) {
                  const d = data.activeLabel;
                  const tasks = perDay.find((x) => x.date === d)?.tasks || [];
                  setModalDate(d);
                  setModalTasks(tasks);
                }
              } : undefined}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={index === 1 ? "day" : index === 2 ? "hour" : index === 3 ? "days" : "date"} stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "0.5rem" }}
              />
              <Bar dataKey={index === 1 ? "avg" : "count"} fill={chart.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      ))}

      <Dialog
        open={!!modalTasks}
        onClose={() => setModalTasks(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-gray-900 text-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto border border-gray-700 shadow-2xl"
        >
          <h3 className="text-xl font-semibold mb-4">
            Tasks completed on {modalDate}
          </h3>
          <ul className="space-y-3">
            {modalTasks?.map((t) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <div className="font-medium text-white">{t.title}</div>
                {t.description && (
                  <div className="text-sm text-gray-400 mt-1">{t.description}</div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  Importance: {t.importance}
                </div>
              </motion.li>
            ))}
          </ul>
          <div className="text-right mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalTasks(null)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </Dialog>
    </div>
  );
}