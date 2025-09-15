// src/app/page.tsx
"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskList from "@/components/TaskList";
import PrioritizedTaskList from "@/components/PrioritizedTaskList";
import { motion } from "framer-motion";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard>
      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">Manage your tasks with elegance</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Task
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <PrioritizedTaskList />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TaskList />
        </motion.div>

        <CreateTaskModal isOpen={open} onClose={() => setOpen(false)} />
      </Layout>
    </AuthGuard>
  );
}