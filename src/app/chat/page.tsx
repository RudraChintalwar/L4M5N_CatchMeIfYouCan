"use client";
import { useState } from "react";
import TaskInput from "@/components/TaskInput";
import Chatbot from "@/components/Chatbot";

export default function ChatPage() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <TaskInput onTasksChange={setTasks} onSelect={setSelectedTask} />
      <Chatbot tasks={tasks} selectedTask={selectedTask} />
    </main>
  );
}
