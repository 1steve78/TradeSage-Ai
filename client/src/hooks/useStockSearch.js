import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "../services/marketApi";

const POPULAR_STOCKS = [
  { symbol: "TCS", companyName: "Tata Consultancy Services Ltd.", exchange: "NSE", type: "Equity" },
  { symbol: "SBIN", companyName: "State Bank of India", exchange: "NSE", type: "Equity" },
  { symbol: "RELIANCE", companyName: "Reliance Industries Ltd.", exchange: "NSE", type: "Equity" },
  { symbol: "INFY", companyName: "Infosys Limited", exchange: "NSE", type: "Equity" },
  { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd.", exchange: "NSE", type: "Equity" },
  { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd.", exchange: "NSE", type: "Equity" },
  { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd.", exchange: "NSE", type: "Equity" },
  { symbol: "AAPL", companyName: "Apple Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "TSLA", companyName: "Tesla, Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "NVDA", companyName: "NVIDIA Corporation", exchange: "NASDAQ", type: "Equity" },
  { symbol: "MSFT", companyName: "Microsoft Corporation", exchange: "NASDAQ", type: "Equity" },
  { symbol: "AMZN", companyName: "Amazon.com, Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", exchange: "NASDAQ", type: "Equity" },
  { symbol: "BTC", companyName: "Bitcoin / USD", exchange: "CRYPTO", type: "Crypto" },
  { symbol: "ETH", companyName: "Ethereum / USD", exchange: "CRYPTO", type: "Crypto" },
];

export default function useStockSearch(query) {
  return useQuery({
    queryKey: ["stock-search", query],
    queryFn: async () => {
      if (!query || !query.trim()) return POPULAR_STOCKS;
      const q = query.trim().toUpperCase();

      let remoteResults = [];
      try {
        remoteResults = await searchStocks(query);
      } catch (err) {
        console.warn("Remote stock search fallback triggered", err);
      }

      // Filter local popular list
      const localMatches = POPULAR_STOCKS.filter(
        (s) => s.symbol.toUpperCase().includes(q) || s.companyName.toUpperCase().includes(q)
      );

      // Merge results avoiding duplicate symbols
      const mergedMap = new Map();
      localMatches.forEach((s) => mergedMap.set(s.symbol, s));
      if (Array.isArray(remoteResults)) {
        remoteResults.forEach((s) => {
          if (!mergedMap.has(s.symbol)) {
            mergedMap.set(s.symbol, {
              symbol: s.symbol,
              companyName: s.companyName || s.description || s.symbol,
              exchange: s.exchange || s.displaySymbol || "EQUITY",
              type: s.type || "Equity",
            });
          }
        });
      }

      return Array.from(mergedMap.values());
    },
    enabled: true,
  });
}