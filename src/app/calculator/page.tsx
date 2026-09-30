"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { CoinMarketData } from "@/lib/types";

interface CurrencyItem {
  id: string;
  name: string;
  symbol: string;
  type: "crypto" | "fiat";
  usdPrice: number; // Unit value expressed in base USD
}

// Standard fiat benchmark rates relative to 1 USD
const FIAT_RATES: Record<string, { name: string; rateFromUsd: number; symbol: string }> = {
  usd: { name: "US Dollar", rateFromUsd: 1, symbol: "$" },
  inr: { name: "Indian Rupee", rateFromUsd: 83.5, symbol: "₹" },
  eur: { name: "Euro", rateFromUsd: 0.92, symbol: "€" },
  gbp: { name: "British Pound", rateFromUsd: 0.79, symbol: "£" },
  jpy: { name: "Japanese Yen", rateFromUsd: 155.2, symbol: "¥" },
  aed: { name: "UAE Dirham", rateFromUsd: 3.67, symbol: "AED" },
  cad: { name: "Canadian Dollar", rateFromUsd: 1.36, symbol: "CA$" },
  aud: { name: "Australian Dollar", rateFromUsd: 1.51, symbol: "A$" },
  chf: { name: "Swiss Franc", rateFromUsd: 0.91, symbol: "CHF" },
  sgd: { name: "Singapore Dollar", rateFromUsd: 1.35, symbol: "SG$" },
};

export default function CalculatorPage() {
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(1);
  const [fromId, setFromId] = useState<string>("bitcoin");
  const [toId, setToId] = useState<string>("fiat-inr");

  const loadRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCoins(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Build the combined list of fiat + crypto currencies
  const currencyList: CurrencyItem[] = useMemo(() => {
    const list: CurrencyItem[] = [];

    // Add cryptos
    coins.forEach((c) => {
      list.push({
        id: c.id,
        name: c.name,
        symbol: c.symbol.toUpperCase(),
        type: "crypto",
        usdPrice: c.current_price,
      });
    });

    // Add fiat currencies
    Object.entries(FIAT_RATES).forEach(([key, val]) => {
      list.push({
        id: `fiat-${key}`,
        name: `${val.name} (${val.symbol})`,
        symbol: key.toUpperCase(),
        type: "fiat",
        usdPrice: 1 / val.rateFromUsd, // 1 Fiat in USD
      });
    });

    return list;
  }, [coins]);

  const fromCurrency = currencyList.find((c) => c.id === fromId);
  const toCurrency = currencyList.find((c) => c.id === toId);

  // Conversion math: Convert `from` into base USD, then from base USD into `to`
  const convertedResult = useMemo(() => {
    if (!fromCurrency || !toCurrency || amount <= 0 || toCurrency.usdPrice === 0) {
      return "0";
    }
    const totalUsd = amount * fromCurrency.usdPrice;
    const finalAmount = totalUsd / toCurrency.usdPrice;

    // Format with dynamic precision
    if (finalAmount > 1000) {
      return finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    if (finalAmount < 0.0001) {
      return finalAmount.toPrecision(6);
    }
    return finalAmount.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Universal Currency Converter
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Convert any cryptocurrency to national currencies (INR, USD, EUR, GBP) or exchange crypto-to-crypto with real-time rates.
        </p>
      </div>

      <div className="bg-krypton-surface/40 border border-krypton-surface rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto space-y-8 shadow-xl">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Amount to Convert
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-krypton-bg border border-krypton-accent rounded-xl text-white font-mono text-xl focus:outline-none focus:border-krypton-gold"
          />
        </div>

        {/* Currency Selectors & Swap */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              From
            </label>
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full px-3 py-3 bg-krypton-bg border border-krypton-accent rounded-xl text-white text-sm focus:outline-none focus:border-krypton-gold"
            >
              <optgroup label="Fiat Currencies">
                {currencyList
                  .filter((c) => c.type === "fiat")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Cryptocurrencies">
                {currencyList
                  .filter((c) => c.type === "crypto")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="flex justify-center pt-2 sm:pt-6 sm:col-span-1">
            <button
              onClick={handleSwap}
              type="button"
              className="p-3 rounded-full bg-krypton-accent hover:bg-krypton-gold hover:text-krypton-bg text-krypton-gold border border-krypton-surface transition-all active:scale-95 shadow-md"
              title="Swap currencies"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              To
            </label>
            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full px-3 py-3 bg-krypton-bg border border-krypton-accent rounded-xl text-white text-sm focus:outline-none focus:border-krypton-gold"
            >
              <optgroup label="Fiat Currencies">
                {currencyList
                  .filter((c) => c.type === "fiat")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Cryptocurrencies">
                {currencyList
                  .filter((c) => c.type === "crypto")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Live Converted Display Box */}
        <div className="p-6 bg-krypton-bg/85 border border-krypton-surface rounded-xl text-center space-y-2 relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Converted Result
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-krypton-gold break-words">
            {convertedResult} {toCurrency?.symbol}
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            1 {fromCurrency?.symbol} ≈{" "}
            {fromCurrency && toCurrency && toCurrency.usdPrice > 0
              ? (fromCurrency.usdPrice / toCurrency.usdPrice).toFixed(6)
              : "0"}{" "}
            {toCurrency?.symbol}
          </div>
        </div>

        {/* Live Refresh Status */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-krypton-surface/40">
          <span>Benchmark: USD Mid-Market Rate</span>
          <button
            onClick={loadRates}
            className="flex items-center gap-1.5 hover:text-krypton-gold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Rates
          </button>
        </div>
      </div>
    </main>
  );
}