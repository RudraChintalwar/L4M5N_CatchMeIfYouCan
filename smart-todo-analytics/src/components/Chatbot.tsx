// src/components/Chatbot.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Msg = { role: "user" | "bot"; text: string };

interface ChatbotProps {
  tasks: string[];
  selectedTask?: any;
}

export default function Chatbot({ tasks, selectedTask }: ChatbotProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
            <motion.li 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {l.replace(/^\d+\.\s+/, "")}
            </motion.li>
          ))}
        </ol>
      );
    }

    return <pre className="whitespace-pre-wrap text-sm">{text}</pre>;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🤖
          </motion.div>
          Task Assistant
        </h2>
        <div className="text-xs px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full border border-purple-700/50">
          {selectedTask ? selectedTask.title : "Select a task to start"}
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-4 p-3 bg-gray-800/50 rounded-lg">
        💡 Tip: ask for a step-by-step plan (e.g. "Plan how to finish this in 2 days")
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto space-y-3 mb-4 max-h-64 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-xl max-w-[85%] ${
                m.role === "user"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white ml-auto"
                  : "bg-gray-700 text-white"
              }`}
            >
              {m.role === "bot" ? renderBotText(m.text) : <div>{m.text}</div>}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 flex items-center gap-2"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            Thinking…
          </motion.div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          aria-label="Ask about selected task"
          className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          className={`p-3 rounded-xl ${
            selectedTask && !loading
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg"
              : "bg-gray-700 cursor-not-allowed"
          } text-white transition-all`}
          disabled={!selectedTask || loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}