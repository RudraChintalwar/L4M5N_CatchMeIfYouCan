// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, tasks, selectedTask } = await req.json();

  // Build context string from tasks
  const taskContext = tasks?.length
    ? `The user has these tasks: ${tasks
        .map((t: any) => (typeof t === "string" ? t : t.title))
        .join(", ")}. Selected task: ${
        selectedTask ? selectedTask.title || selectedTask : "None"
      }.`
    : "The user has no tasks yet.";

  // If no key, return mock response
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      reply: `🤖 (Mock Reply) ${taskContext}\n1. Step one\n2. Step two\n3. Step three`,
    });
  }

  try {
    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful productivity coach. Always answer in plain text only. Use a clear numbered list (1.,2.,3.,...) for a step-by-step plan. Do NOT output JSON or code.",
            },
            {
              role: "user",
              content: `${taskContext}\nUser request: ${message}`,
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      console.error("❌ Groq API error:", await res.text());
      return NextResponse.json({
        reply: `⚠️ Groq API error: ${res.status}`,
      });
    }

    const data = await res.json();

    // Groq returns choices[0].message.content
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      "⚠️ No reply from model.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("🚨 Groq API Call Failed:", err);
    return NextResponse.json({
      reply: "⚠️ Couldn't connect to Groq API.",
    });
  }
}
