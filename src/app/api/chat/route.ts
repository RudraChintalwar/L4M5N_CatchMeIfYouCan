import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, tasks, selectedTask } = await req.json();

  // Build context from tasks
  const taskContext = tasks?.length
    ? `The user has these tasks: ${tasks.join(", ")}. Selected task: ${selectedTask || "None"}.`
    : "The user has no tasks yet.";

  // If no key, return mock response
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️ No GROQ_API_KEY found — using mock reply");
    return NextResponse.json({
      reply: `🤖 (Mock Reply) Tasks: ${taskContext}\n💡 Focus on time-blocking for better productivity.`,
    });
  }

  try {
    // Call Groq API instead of OpenAI
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast, good for hackathons
        messages: [
          {
            role: "system",
            content:
              "You are a helpful productivity coach. Suggest smart, efficient ways to manage tasks and give short, actionable advice.",
          },
          {
            role: "user",
            content: `${taskContext}\nUser message: ${message}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("❌ Groq API error:", await res.text());
      return NextResponse.json({ reply: "⚠️ Groq API error, try again later." });
    }

    const data = await res.json();

    if (!data.choices || !data.choices[0]) {
      console.error("⚠️ Unexpected Groq API response:", data);
      return NextResponse.json({ reply: "⚠️ No reply from Groq model." });
    }

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("🚨 Groq API Call Failed:", err);
    return NextResponse.json({ reply: "⚠️ Couldn't connect to Groq API." });
  }
}
