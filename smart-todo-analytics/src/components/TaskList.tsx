// src/components/TaskList.tsx
"use client";
import { useTasks, Task } from "@/hooks/useTasks";
import dayjs from "dayjs";

export default function TaskList() {
  const { tasks, toggleComplete, removeTask } = useTasks();

  const importanceRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  const sorted = [...tasks].sort((a: Task, b: Task) => {
    const ai = importanceRank[a.importance] ?? 2;
    const bi = importanceRank[b.importance] ?? 2;
    if (bi !== ai) return bi - ai;
    if (a.dueAt && b.dueAt) {
      return (a.dueAt.getTime() ?? 0) - (b.dueAt.getTime() ?? 0);
    }
    return 0;
  });

  if (!sorted.length) {
    return <div className="text-gray-500 py-8">No tasks yet — add one!</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((task) => (
        <div key={task.id} className="p-4 bg-gray-900 text-white rounded-xl shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {task.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{task.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span
                  className={`px-2 py-1 rounded ${
                    task.importance === "High"
                      ? "bg-red-600"
                      : task.importance === "Medium"
                      ? "bg-yellow-500 text-black"
                      : "bg-green-600"
                  }`}
                >
                  {task.importance}
                </span>

                {task.dueAt && (
                  <span className="text-gray-400">Due: {dayjs(task.dueAt).format("MMM D")}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
                className="w-5 h-5"
              />
              <button
                onClick={() => removeTask(task.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
