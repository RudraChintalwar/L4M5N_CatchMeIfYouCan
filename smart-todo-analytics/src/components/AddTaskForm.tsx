// src/components/AddTaskForm.tsx
"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { motion } from "framer-motion";

export default function AddTaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<number>(5);
  const [dueAt, setDueAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(
      title,
      description,
      importance,
      dueAt ? new Date(dueAt) : undefined
    );
    setTitle("");
    setDescription("");
    setImportance(5);
    setDueAt("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700"
    >
      <input
        type="text"
        placeholder="Task title..."
        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description..."
        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[100px]"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Importance: {importance}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={importance}
          onChange={(e) => setImportance(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
        />
      </div>

      <input
        type="date"
        className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
      >
        Add Task
      </motion.button>
    </motion.form>
  );
}