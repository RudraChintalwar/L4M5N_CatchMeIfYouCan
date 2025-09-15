// src/components/AddTaskForm.tsx
"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";

export default function AddTaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // if you prefer slider -> numeric; hook will normalize to High/Med/Low
  const [importance, setImportance] = useState<number>(5);
  const [dueAt, setDueAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(
      title,
      description,
      importance, // numeric 1..10 is accepted and normalized by the hook
      dueAt ? new Date(dueAt) : undefined
    );
    setTitle("");
    setDescription("");
    setImportance(5);
    setDueAt("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg">
      <input
        type="text"
        placeholder="Task title..."
        className="px-3 py-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description..."
        className="px-3 py-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="text-sm text-gray-600">Importance: {importance}</label>
      <input
        type="range"
        min="1"
        max="10"
        value={importance}
        onChange={(e) => setImportance(Number(e.target.value))}
      />

      <input
        type="date"
        className="px-3 py-2 border rounded"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Add Task
      </button>
    </form>
  );
}
