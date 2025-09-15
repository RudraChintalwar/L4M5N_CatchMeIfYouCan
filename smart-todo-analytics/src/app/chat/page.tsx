// src/app/chat/page.tsx
"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import { useTasks } from "@/hooks/useTasks";
import Chatbot from "@/components/Chatbot";
import { motion } from "framer-motion";

export default function ChatPage() {
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <AuthGuard>
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Task Assistant 🤖
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Select a task and chat with the AI about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <select
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <option value="">Select a task</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Chatbot
            tasks={tasks.map((t) => t.title)}
            selectedTask={selectedTask}
          />
        </motion.div>
      </Layout>
    </AuthGuard>
  );
}