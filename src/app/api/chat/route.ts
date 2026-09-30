import { NextResponse } from "next/server";

// Priority model list with automatic multi-tier fallback
const MODELS_PRIORITY = [
  "openai/gpt-oss-120b",      // Primary: Top capability
  "qwen/qwen3.8-27b",         // Fallback 1: High speed & reasoning
  "openai/gpt-oss-20b",       // Fallback 2: Lean & responsive
  "groq/compound-mini",       // Fallback 3: Lightweight compound
];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "API Key missing. Please set GROQ_API_KEY in your .env.local file.",
      });
    }

    let lastErrorMessage = "Unknown error";

    // Loop through priority chain
    for (const model of MODELS_PRIORITY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
            {
                role: "system",
                content:"You are the Krypton Crypto Assistant created by Rohan Chavan. Answer questions concisely (under 120 words). Use clean Markdown formatting: lead with 1 crisp definition sentence, follow with 3-4 bullet points for key mechanics, and avoid massive walls of text, tables, or generic financial disclaimers.",
            },
            ...messages,
            ],
            temperature: 0.4, // Lower temperature reduces verbosity
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices?.[0]?.message?.content) {
            return NextResponse.json({
              reply: data.choices[0].message.content,
              modelUsed: model,
            });
          }
        }

        const errorPayload = await response.json().catch(() => ({}));
        lastErrorMessage = errorPayload.error?.message || `Status ${response.status}`;
        console.warn(`Model ${model} failed: ${lastErrorMessage}. Trying next fallback...`);
      } catch (err: any) {
        lastErrorMessage = err?.message || "Network call failed";
        console.warn(`Fetch error on model ${model}: ${lastErrorMessage}. Trying next fallback...`);
      }
    }

    // If all models in the chain fail
    return NextResponse.json(
      { error: `All models exhausted. Last error: ${lastErrorMessage}` },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error processing chat request" },
      { status: 500 }
    );
  }
}