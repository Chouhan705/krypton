"use client";

import { useState, useEffect } from "react";
import { useWalletStore } from "@/lib/store/useWalletStore";
import { CoinMarketData } from "@/lib/types";
import { Wallet, ArrowDownRight, ArrowUpRight, RotateCcw } from "lucide-react";

export default function WalletPage() {
  const { usdBalance, holdings, transactions, buyCoin, sellCoin, resetWallet } = useWalletStore();
  const [coins, setCoins] = useState<CoinMarketData[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState("");
  const [tradeAmount, setTradeAmount] = useState<number>(100);

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCoins(data);
          if (data.length > 0) setSelectedCoinId(data[0].id);
        }
      });
  }, []);

  const activeCoin = coins.find((c) => c.id === selectedCoinId);

  const portfolioValue = Object.values(holdings).reduce((total, item) => {
    const currentPrice = coins.find((c) => c.id === item.coinId)?.current_price || item.avgBuyPrice;
    return total + item.amount * currentPrice;
  }, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Paper Trading Wallet</h1>
          <p className="text-zinc-400 text-sm">Practice crypto trading with a virtual $10,000 USD balance.</p>
        </div>
        <button
          onClick={resetWallet}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-krypton-surface hover:bg-krypton-accent text-zinc-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Balance
        </button>
      </div>

      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-krypton-surface/40 border border-krypton-surface">
          <span className="text-xs text-zinc-400 uppercase font-bold">Virtual Cash</span>
          <p className="text-3xl font-black font-mono text-krypton-gold mt-1">${usdBalance.toFixed(2)}</p>
        </div>
        <div className="p-6 rounded-xl bg-krypton-surface/40 border border-krypton-surface">
          <span className="text-xs text-zinc-400 uppercase font-bold">Invested Holdings</span>
          <p className="text-3xl font-black font-mono text-white mt-1">${portfolioValue.toFixed(2)}</p>
        </div>
        <div className="p-6 rounded-xl bg-krypton-surface/40 border border-krypton-surface">
          <span className="text-xs text-zinc-400 uppercase font-bold">Total Net Worth</span>
          <p className="text-3xl font-black font-mono text-krypton-gold mt-1">
            ${(usdBalance + portfolioValue).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Trading Panel */}
      <div className="bg-krypton-surface/30 border border-krypton-surface rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white">Place Virtual Order</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Select Asset</label>
            <select
              value={selectedCoinId}
              onChange={(e) => setSelectedCoinId(e.target.value)}
              className="w-full px-3 py-2.5 bg-krypton-bg border border-krypton-accent rounded-lg text-white text-sm"
            >
              {coins.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.current_price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Trade Amount (USD)</label>
            <input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-krypton-bg border border-krypton-accent rounded-lg text-white font-mono text-sm"
            />
          </div>

          <div className="flex items-end gap-3">
            <button
              onClick={() => {
                if (activeCoin) {
                  buyCoin(
                    {
                      id: activeCoin.id,
                      name: activeCoin.name,
                      symbol: activeCoin.symbol,
                      price: activeCoin.current_price,
                    },
                    tradeAmount
                  );
                }
              }}
              className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Buy
            </button>
            <button
              onClick={() => {
                if (activeCoin && holdings[activeCoin.id]) {
                  const coinUnits = tradeAmount / activeCoin.current_price;
                  sellCoin(activeCoin.id, coinUnits, activeCoin.current_price);
                }
              }}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Your Holdings</h3>
        {Object.keys(holdings).length === 0 ? (
          <p className="text-sm text-zinc-500">No tokens purchased yet. Place an order above!</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-krypton-surface">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-krypton-surface/60 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="p-4">Asset</th>
                  <th className="p-4">Holdings</th>
                  <th className="p-4">Avg Buy Price</th>
                  <th className="p-4">Current Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-krypton-surface/40">
                {Object.values(holdings).map((h) => {
                  const currentPrice = coins.find((c) => c.id === h.coinId)?.current_price || h.avgBuyPrice;
                  return (
                    <tr key={h.coinId}>
                      <td className="p-4 font-bold text-white">{h.name} ({h.symbol})</td>
                      <td className="p-4 font-mono">{h.amount.toFixed(4)}</td>
                      <td className="p-4 font-mono">${h.avgBuyPrice.toFixed(2)}</td>
                      <td className="p-4 font-mono text-krypton-gold">
                        ${(h.amount * currentPrice).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}