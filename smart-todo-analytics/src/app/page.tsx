// src/app/page.tsx
"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskList from "@/components/TaskList";
import PrioritizedTaskList from "@/components/PrioritizedTaskList"; // 👈 import our new component

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <AuthGuard>
      <Layout>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your tasks</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            + New Task
          </button>
        </div>

        {/* 👇 recommended order appears above the normal task list */}
        <div className="mb-10">
          <PrioritizedTaskList />
        </div>

        {/* existing list of tasks */}
        <TaskList />

        <CreateTaskModal isOpen={open} onClose={() => setOpen(false)} />
      </Layout>
    </AuthGuard>
  );
}
