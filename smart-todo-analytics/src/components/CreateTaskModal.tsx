// src/components/CreateTaskModal.tsx
"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateTaskModal({ isOpen, onClose }: Props) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<"High" | "Medium" | "Low">("Medium");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;
    await addTask(
      title.trim(),
      description.trim(),
      importance,
      dueDate ? new Date(dueDate) : null
    );
    setTitle("");
    setDescription("");
    setImportance("Medium");
    setDueDate("");
    onClose();
  };

  return (

    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Replace this: <Dialog.Overlay className="fixed inset-0 bg-black/40" /> */}
  <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

  <div className="relative z-10 w-full max-w-md p-6 rounded-xl bg-gray-900 text-white shadow-xl">
    <Dialog.Title className="text-lg font-semibold mb-3">Create Task</Dialog.Title>
    {/* ...rest of modal */}
    <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Task name"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Description (optional)"
            rows={4}
          />

          <div className="flex gap-3">
            <select
              value={importance}
              onChange={(e) => setImportance(e.target.value as any)}
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="p-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
          >
            Create Task
          </button>
        </div>
  </div>
</Dialog>

  );
}
