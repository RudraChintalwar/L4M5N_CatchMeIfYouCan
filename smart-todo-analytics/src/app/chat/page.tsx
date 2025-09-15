"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import AuthGuard from "@/components/AuthGuard";
import { useTasks } from "@/hooks/useTasks";
import Chatbot from "@/components/Chatbot";

export default function ChatPage() {
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <AuthGuard>
      <Layout>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Task Assistant 🤖</h1>
          <p className="text-sm text-gray-500">
            Select a task and chat with the AI about it.
          </p>
        </div>

        <div className="mb-4">
          <select
            className="p-2 border rounded"
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
        </div>

        <Chatbot
          tasks={tasks.map((t) => t.title)}
          selectedTask={selectedTask}
        />
      </Layout>
    </AuthGuard>
  );
}
