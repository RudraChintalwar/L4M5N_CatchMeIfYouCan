"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Chatbot({ tasks, selectedTask }: any) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const userInput = input;
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput, tasks, selectedTask }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-gray-800 rounded-2xl shadow-lg flex flex-col p-4">
      <h2 className="text-lg font-bold text-center mb-2">🤖 Task Assistant</h2>
        <p className="text-xs text-gray-400 mb-2">
        Current tasks: {tasks.length > 0 ? tasks.join(", ") : "No tasks yet"}
        </p>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 max-h-64">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-2 rounded-lg max-w-[80%] ${
              m.role === "user"
                ? "bg-blue-600 text-right ml-auto"
                : "bg-gray-700 text-left"
            }`}
          >
            {m.text}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a task..."
          className="flex-1 p-2 rounded-lg text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 px-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
