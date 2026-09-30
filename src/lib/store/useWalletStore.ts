import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletHolding, Transaction } from "../types";

interface WalletState {
  usdBalance: number;
  holdings: Record<string, WalletHolding>;
  transactions: Transaction[];
  buyCoin: (coin: { id: string; symbol: string; name: string; price: number }, usdAmount: number) => boolean;
  sellCoin: (coinId: string, coinAmount: number, currentPrice: number) => boolean;
  resetWallet: () => void;
}

const INITIAL_BALANCE = 10000;

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      usdBalance: INITIAL_BALANCE,
      holdings: {},
      transactions: [],

      buyCoin: (coin, usdAmount) => {
        const { usdBalance, holdings, transactions } = get();
        if (usdAmount <= 0 || usdAmount > usdBalance) return false;

        const coinAmount = usdAmount / coin.price;
        const existingHolding = holdings[coin.id];

        const updatedHolding: WalletHolding = existingHolding
          ? {
              ...existingHolding,
              amount: existingHolding.amount + coinAmount,
              avgBuyPrice:
                (existingHolding.amount * existingHolding.avgBuyPrice + usdAmount) /
                (existingHolding.amount + coinAmount),
            }
          : {
              coinId: coin.id,
              symbol: coin.symbol.toUpperCase(),
              name: coin.name,
              amount: coinAmount,
              avgBuyPrice: coin.price,
            };

        const newTx: Transaction = {
          id: crypto.randomUUID(),
          type: "BUY",
          coinId: coin.id,
          symbol: coin.symbol.toUpperCase(),
          amount: coinAmount,
          price: coin.price,
          total: usdAmount,
          timestamp: Date.now(),
        };

        set({
          usdBalance: usdBalance - usdAmount,
          holdings: { ...holdings, [coin.id]: updatedHolding },
          transactions: [newTx, ...transactions],
        });

        return true;
      },

      sellCoin: (coinId, coinAmount, currentPrice) => {
        const { usdBalance, holdings, transactions } = get();
        const existingHolding = holdings[coinId];

        if (!existingHolding || coinAmount <= 0 || coinAmount > existingHolding.amount) {
          return false;
        }

        const usdReturn = coinAmount * currentPrice;
        const remainingAmount = existingHolding.amount - coinAmount;

        const newHoldings = { ...holdings };
        if (remainingAmount <= 0.000001) {
          delete newHoldings[coinId];
        } else {
          newHoldings[coinId] = {
            ...existingHolding,
            amount: remainingAmount,
          };
        }

        const newTx: Transaction = {
          id: crypto.randomUUID(),
          type: "SELL",
          coinId,
          symbol: existingHolding.symbol,
          amount: coinAmount,
          price: currentPrice,
          total: usdReturn,
          timestamp: Date.now(),
        };

        set({
          usdBalance: usdBalance + usdReturn,
          holdings: newHoldings,
          transactions: [newTx, ...transactions],
        });

        return true;
      },

      resetWallet: () => {
        set({
          usdBalance: INITIAL_BALANCE,
          holdings: {},
          transactions: [],
        });
      },
    }),
    {
      name: "krypton-wallet-storage",
    }
  )
);