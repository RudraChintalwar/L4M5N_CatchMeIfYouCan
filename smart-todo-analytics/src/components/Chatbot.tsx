// src/components/Chatbot.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Msg = { role: "user" | "bot"; text: string };

interface ChatbotProps {
  tasks: string[]; // or titles list
  selectedTask?: any;
}

export default function Chatbot({ tasks, selectedTask }: ChatbotProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!selectedTask) {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Please select a task first." },
      ]);
      return;
    }

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, tasks, selectedTask }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "No response body");
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: `Provider error: ${res.status}. ${txt}` },
        ]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const reply = data?.reply ?? "No reply from assistant";
      setMessages((prev) => [...prev, { role: "bot", text: String(reply) }]);
    } catch (err) {
      console.error("chat send error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Network error: could not contact server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Render either a nicely parsed numbered list or a plain preformatted block
  const renderBotText = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const allNumbered = lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l));

    if (allNumbered) {
      return (
        <ol className="list-decimal list-inside text-sm space-y-2">
          {lines.map((l, i) => (
            <li key={i}>{l.replace(/^\d+\.\s+/, "")}</li>
          ))}
        </ol>
      );
    }

    // otherwise show as pre (preserve newlines)
    return <pre className="whitespace-pre-wrap text-sm">{text}</pre>;
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">🤖 Task Assistant</h2>
        <div className="text-xs text-gray-400">
          {selectedTask ? selectedTask.title : "Select a task to start"}
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Tip: ask for a step-by-step plan (e.g. "Plan how to finish this in 2 days")
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto space-y-2 mb-3 max-h-64 pr-2"
      >
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={`p-2 rounded-lg max-w-[90%] ${
              m.role === "user"
                ? "bg-indigo-600 text-white ml-auto text-right"
                : "bg-gray-700 text-white text-left"
            }`}
          >
            {m.role === "bot" ? renderBotText(m.text) : <div>{m.text}</div>}
          </motion.div>
        ))}

        {loading && (
          <div className="text-sm text-gray-300">Thinking…</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          aria-label="Ask about selected task"
          className="flex-1 p-2 rounded-lg text-black"
          placeholder={
            selectedTask ? "Ask for a step-by-step plan..." : "Select a task first"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={!selectedTask || loading}
        />
        <button
          onClick={sendMessage}
          className={`px-3 rounded-lg ${
            selectedTask && !loading
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-600 cursor-not-allowed"
          } text-white`}
          disabled={!selectedTask || loading}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
