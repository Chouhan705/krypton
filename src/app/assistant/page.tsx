"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I am the Krypton Crypto Assistant. Ask me anything about blockchain, consensus mechanisms, DeFi, or smart contracts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || data.error }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to the assistant server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Bot className="w-8 h-8 text-krypton-gold" /> Crypto Knowledge Chatbot
        </h1>
        <p className="text-zinc-400 text-sm">Concise Web3 intelligence powered by Groq.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-krypton-surface bg-krypton-surface/20">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="p-2 rounded-lg bg-krypton-accent text-krypton-gold h-fit shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-krypton-gold text-krypton-bg font-medium"
                  : "bg-krypton-surface/80 text-zinc-200 border border-krypton-surface prose prose-invert prose-sm"
              }`}
            >
              {m.role === "user" ? (
                m.content
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-normal">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                    li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                    strong: ({ children }) => <strong className="text-krypton-gold font-semibold">{children}</strong>,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              )}
            </div>
            {m.role === "user" && (
              <div className="p-2 rounded-lg bg-krypton-gold text-krypton-bg h-fit shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-zinc-500 italic animate-pulse">Assistant is thinking...</div>
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What is Bitcoin?"
          className="flex-1 px-4 py-3 bg-krypton-surface/50 border border-krypton-surface rounded-xl text-white text-sm focus:outline-none focus:border-krypton-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 bg-krypton-gold hover:bg-krypton-gold-muted text-krypton-bg font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  );
}