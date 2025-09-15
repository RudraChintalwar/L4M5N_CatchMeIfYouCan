"use client";
import { useState, useEffect } from "react";

export default function TaskInput({ onTasksChange, onSelect }: any) {
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // ✅ Load tasks & selectedTask from localStorage when component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedSelected = localStorage.getItem("selectedTask");

    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed);
      onTasksChange(parsed);
    }
    if (savedSelected) {
      setSelected(savedSelected);
      onSelect(savedSelected);
    }
  }, []);

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Save selectedTask to localStorage whenever it changes
  useEffect(() => {
    if (selected) {
      localStorage.setItem("selectedTask", selected);
    } else {
      localStorage.removeItem("selectedTask");
    }
  }, [selected]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTasks = [...tasks, input];
    setTasks(newTasks);
    onTasksChange(newTasks);
    setInput("");
  };

  const selectTask = (task: string) => {
    setSelected(task);
    onSelect(task);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h1 className="text-xl font-bold mb-3">📝 Smart To-Do List</h1>

      {/* Task input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          className="flex-1 p-2 rounded-lg text-black"
        />
        <button
          onClick={addTask}
          className="bg-green-500 hover:bg-green-600 px-3 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Task list with selectable items */}
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            onClick={() => selectTask(t)}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              selected === t ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {t}
          </li>
        ))}
      </ul>

      {selected && (
        <p className="text-xs text-gray-400 mt-2">
          ✅ Selected Task: <span className="font-semibold">{selected}</span>
        </p>
      )}
    </div>
  );
}
