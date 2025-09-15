// src/components/TaskList.tsx
"use client";
import { useTasks, Task } from "@/hooks/useTasks";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

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
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 py-12 text-center"
      >
        <div className="text-6xl mb-4">📝</div>
        <p>No tasks yet — add one to get started!</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence>
        {sorted.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : "text-white"}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{task.description}</p>
                <div className="flex items-center gap-2 mt-4 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      task.importance === "High"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : task.importance === "Medium"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "bg-green-500/20 text-green-300 border border-green-500/30"
                    }`}
                  >
                    {task.importance}
                  </span>

                  {task.dueAt && (
                    <span className="text-gray-400">
                      Due: {dayjs(task.dueAt).format("MMM D")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleComplete(task.id, task.completed)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-600 hover:border-purple-500"
                  }`}
                >
                  {task.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeTask(task.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}