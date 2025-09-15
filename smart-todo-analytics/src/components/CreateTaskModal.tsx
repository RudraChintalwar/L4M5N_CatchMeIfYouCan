// src/components/CreateTaskModal.tsx
"use client";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl border border-gray-700"
          >
            <Dialog.Title className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Create Task
            </Dialog.Title>
            
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Task name"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[120px]"
                placeholder="Description (optional)"
                rows={4}
              />

              <div className="flex gap-3">
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as any)}
                  className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition-all"
              >
                Create Task
              </motion.button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}