export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
}

export interface WalletHolding {
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  avgBuyPrice: number;
}

export interface Transaction {
  id: string;
  type: "BUY" | "SELL";
  coinId: string;
  symbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: number;
}