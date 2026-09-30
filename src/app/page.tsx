import Link from "next/link";
import {
  Wallet,
  LineChart,
  Bot,
  Calculator,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import CreatorCard from "@/components/CreatorCard";
import RotatingCoinCanvas from "@/components/RotatingCoinCanvas";

export default function Home() {
  return (
    <main className="space-y-24">
      {/* Full Screen Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden border-b border-krypton-surface/50">
        {/* Subtle background ambient radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-krypton-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-krypton-gold/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-krypton-surface/90 border border-krypton-olive/50 text-krypton-gold text-xs font-bold tracking-wider uppercase shadow-inner">
  <Sparkles className="w-3.5 h-3.5" />
  Next-Gen Web3 Simulation
</div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Master Crypto Without The{" "}
              <span className="text-krypton-gold underline decoration-krypton-olive underline-offset-8">
                Financial Risk
              </span>
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Simulate paper trading using our zero-loss virtual wallet, monitor real-time token prices, convert currencies instantly, and get market insights via our AI crypto assistant.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/wallet"
                className="bg-krypton-gold hover:bg-krypton-gold-muted text-krypton-bg font-extrabold px-7 py-3.5 rounded-xl flex items-center gap-2.5 transition-all active:scale-95 shadow-xl shadow-krypton-gold/20"
              >
                Start Virtual Trading <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/prices"
                className="bg-krypton-surface/80 hover:bg-krypton-accent text-zinc-200 font-semibold px-6 py-3.5 rounded-xl border border-krypton-olive/40 transition-colors"
              >
                View Live Tickers
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-krypton-gold" /> $10,000 Paper Funds
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-krypton-gold" /> Real-time CoinGecko API
              </span>
            </div>
          </div>

          {/* Right Column: Full Interactive Revolving 3D Coin */}
          <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[450px] sm:h-[550px] lg:h-[650px]">
            <RotatingCoinCanvas />
          </div>
        </div>
      </section>

      {/* Feature Pages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Platform Capabilities</h2>
          <p className="text-zinc-400 text-sm">Four focused tools designed for real-time practice and analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Virtual Wallet",
              desc: "Simulate spot buys and sells with a virtual balance. Track portfolio profit and loss in real-time.",
              href: "/wallet",
              icon: Wallet,
            },
            {
              title: "Live Price Feed",
              desc: "Fetch real-time crypto prices, 24h volume shifts, and market cap metrics directly from CoinGecko.",
              href: "/prices",
              icon: LineChart,
            },
            {
              title: "Crypto Chatbot",
              desc: "Ask nuanced Web3 and DeFi queries powered by Groq ultra-fast Llama-3 inference.",
              href: "/assistant",
              icon: Bot,
            },
            {
              title: "Value Converter",
              desc: "Convert fiat currencies (USD, INR, EUR) to Bitcoin, Ethereum, and major altcoins instantly.",
              href: "/calculator",
              icon: Calculator,
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-2xl bg-krypton-surface/40 border border-krypton-surface hover:border-krypton-gold/50 transition-all hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 w-fit rounded-xl bg-krypton-accent/70 text-krypton-gold mb-5 group-hover:bg-krypton-gold group-hover:text-krypton-bg transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{feature.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-krypton-gold">
                  Explore Feature <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Creator Info & Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CreatorCard />
      </section>
    </main>
  );
}