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

  return (
    <div className="space-y-10">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Average Completion Time</h3>
          <p className="text-3xl mt-2">{avgCompletionDays.toFixed(1)} days</p>
        </div>
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Procrastination Score</h3>
          <p className="text-3xl mt-2">{procrastinationScore}% late</p>
        </div>
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold">Total Completed Tasks</h3>
          <p className="text-3xl mt-2">{totalCompleted}</p>
        </div>
      </div>

      {/* Chart 1: Completed per Day */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Tasks Completed per Day (click bar for details)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={perDay}
            onClick={(data) => {
              if (data && data.activeLabel) {
                const d = data.activeLabel;
                const tasks = perDay.find((x) => x.date === d)?.tasks || [];
                setModalDate(d);
                setModalTasks(tasks);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Completed by Day of Week */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Tasks Completed by Day of Week</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perDOW}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="avg" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 3: Power Hours */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Power Hours (Tasks Completed per Hour)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perHour}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="hour" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Completion Velocity */}
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">
            Completion Velocity (how fast you complete tasks)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionVelocity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="days" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>

      {/* Modal for tasks details */}
      <Dialog
        open={!!modalTasks}
        onClose={() => setModalTasks(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="relative z-10 bg-gray-900 text-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
          <h3 className="text-xl font-semibold mb-4">
            Tasks completed on {modalDate}
          </h3>
          <ul className="space-y-2">
            {modalTasks?.map((t) => (
              <li key={t.id} className="p-3 bg-gray-800 rounded-lg">
                <div className="font-medium">{t.title}</div>
                {t.description && (
                  <div className="text-sm text-gray-400">{t.description}</div>
                )}
                <div className="text-xs text-gray-400">
                  Importance: {t.importance}
                </div>
              </li>
            ))}
          </ul>
          <div className="text-right mt-4">
            <button
              onClick={() => setModalTasks(null)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
