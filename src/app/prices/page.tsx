"use client";

import { useEffect, useState } from "react";
import { CoinMarketData } from "@/lib/types";
import { Search, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

export default function PricesPage() {
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (Array.isArray(data)) setCoins(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Live Crypto Tickers</h1>
          <p className="text-zinc-400 text-sm">Real-time market valuation and 24h movements.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search coin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-krypton-surface/50 border border-krypton-surface rounded-lg text-sm text-white focus:outline-none focus:border-krypton-gold"
            />
          </div>
          <button
            onClick={fetchPrices}
            className="p-2.5 bg-krypton-surface hover:bg-krypton-accent text-krypton-gold rounded-lg border border-krypton-surface transition-colors"
            title="Refresh prices"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-krypton-surface bg-krypton-surface/20 backdrop-blur-sm">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-krypton-surface/60 text-xs uppercase text-zinc-400">
            <tr>
              <th className="p-4">Coin</th>
              <th className="p-4">Price</th>
              <th className="p-4">24h Change</th>
              <th className="p-4 hidden sm:table-cell">24h Volume</th>
              <th className="p-4 hidden md:table-cell">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-krypton-surface/40">
            {filteredCoins.map((coin) => {
              const isPositive = coin.price_change_percentage_24h >= 0;
              return (
                <tr key={coin.id} className="hover:bg-krypton-surface/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="font-bold text-white">{coin.name}</div>
                      <div className="text-xs text-zinc-500 uppercase">{coin.symbol}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-white">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded ${
                        isPositive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400 hidden sm:table-cell">
                    ${coin.total_volume?.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-zinc-400 hidden md:table-cell">
                    ${coin.market_cap?.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}