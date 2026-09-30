"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

export default function CreatorCard() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-krypton-surface/40 border border-krypton-surface rounded-2xl p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <span className="text-krypton-gold text-xs font-bold uppercase tracking-wider">
            About The Creator
          </span>
          <h3 className="text-3xl font-extrabold text-white">Rohan Chavan</h3>
          <p className="text-zinc-300 text-sm leading-relaxed">
            BSc. Computer Science student, passionate developer exploring Web3 architectures,
            crypto economics, and high-performance web applications.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-krypton-accent hover:bg-krypton-olive text-white transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-krypton-accent hover:bg-krypton-olive text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-krypton-accent hover:bg-krypton-olive text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Contact Box */}
        <div className="bg-krypton-bg/60 p-6 rounded-xl border border-krypton-surface">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-krypton-gold" />
              <h4 className="text-lg font-bold text-white">Message Sent!</h4>
              <p className="text-xs text-zinc-400">
                Routed to chavanrohan4333@gmail.com.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-200">Send Direct Message</h4>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Satoshi Nakamoto"
                  className="w-full px-3 py-2 rounded-lg bg-krypton-surface/50 border border-krypton-accent text-white text-sm focus:outline-none focus:border-krypton-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="satoshin@gmx.com"
                  className="w-full px-3 py-2 rounded-lg bg-krypton-surface/50 border border-krypton-accent text-white text-sm focus:outline-none focus:border-krypton-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Message</label>
                <textarea
                  name="message"
                  rows={3}
                  required
                  placeholder="Drop a note or question..."
                  className="w-full px-3 py-2 rounded-lg bg-krypton-surface/50 border border-krypton-accent text-white text-sm focus:outline-none focus:border-krypton-gold resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-krypton-gold hover:bg-krypton-gold-muted text-krypton-bg font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send to Rohan Chavan</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}