import { useState, useEffect, useRef } from "react";
import { searchStocks } from "../services/marketApi";

const POPULAR_STOCKS = [
  { symbol: "TCS", companyName: "Tata Consultancy Services Ltd.", exchange: "NSE", token: "11536", type: "Equity" },
  { symbol: "SBIN", companyName: "State Bank of India", exchange: "NSE", token: "3045", type: "Equity" },
  { symbol: "RELIANCE", companyName: "Reliance Industries Ltd.", exchange: "NSE", token: "2885", type: "Equity" },
  { symbol: "INFY", companyName: "Infosys Limited", exchange: "NSE", token: "1594", type: "Equity" },
  { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd.", exchange: "NSE", token: "1333", type: "Equity" },
  { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd.", exchange: "NSE", token: "3456", type: "Equity" },
  { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd.", exchange: "NSE", token: "4963", type: "Equity" },
  { symbol: "WIPRO", companyName: "Wipro Limited", exchange: "NSE", token: "3787", type: "Equity" },
  { symbol: "BAJFINANCE", companyName: "Bajaj Finance Ltd.", exchange: "NSE", token: "317", type: "Equity" },
  { symbol: "AXISBANK", companyName: "Axis Bank Ltd.", exchange: "NSE", token: "5900", type: "Equity" },
  { symbol: "KOTAKBANK", companyName: "Kotak Mahindra Bank Ltd.", exchange: "NSE", token: "1922", type: "Equity" },
  { symbol: "SUNPHARMA", companyName: "Sun Pharmaceutical Industries Ltd.", exchange: "NSE", token: "3351", type: "Equity" },
  { symbol: "TITAN", companyName: "Titan Company Ltd.", exchange: "NSE", token: "3506", type: "Equity" },
  { symbol: "MARUTI", companyName: "Maruti Suzuki India Ltd.", exchange: "NSE", token: "10999", type: "Equity" },
  { symbol: "ADANIENT", companyName: "Adani Enterprises Ltd.", exchange: "NSE", token: "25", type: "Equity" },
  { symbol: "NTPC", companyName: "NTPC Limited", exchange: "NSE", token: "11630", type: "Equity" },
  { symbol: "BHARTIARTL", companyName: "Bharti Airtel Ltd.", exchange: "NSE", token: "10604", type: "Equity" },
  { symbol: "GODREJIND", companyName: "Godrej Industries Ltd.", exchange: "NSE", token: "10925", type: "Equity" },
  { symbol: "LT", companyName: "Larsen & Toubro Ltd.", exchange: "NSE", token: "11483", type: "Equity" },
  { symbol: "HINDUNILVR", companyName: "Hindustan Unilever Ltd.", exchange: "NSE", token: "1394", type: "Equity" },
  { symbol: "AAPL", companyName: "Apple Inc.", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "TSLA", companyName: "Tesla, Inc.", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "NVDA", companyName: "NVIDIA Corporation", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "MSFT", companyName: "Microsoft Corporation", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "AMZN", companyName: "Amazon.com, Inc.", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", exchange: "NASDAQ", token: null, type: "Equity" },
  { symbol: "BTC", companyName: "Bitcoin / USD", exchange: "CRYPTO", token: null, type: "Crypto" },
  { symbol: "ETH", companyName: "Ethereum / USD", exchange: "CRYPTO", token: null, type: "Crypto" },
];

/**
 * Fast two-phase stock search:
 * Phase 1 (instant): Filter POPULAR_STOCKS locally — zero network latency.
 * Phase 2 (async):   Hit the server with a 300ms debounce and merge extra results.
 */
export default function useStockSearch(query) {
  const [results, setResults] = useState(POPULAR_STOCKS);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const latestQuery = useRef("");

  useEffect(() => {
    const q = (query || "").trim().toUpperCase();
    latestQuery.current = q;

    // --- Phase 1: Instant local filter (synchronous, 0ms) ---
    if (!q) {
      setResults(POPULAR_STOCKS);
      setIsLoading(false);
      clearTimeout(debounceTimer.current);
      return;
    }

    const localMatches = POPULAR_STOCKS.filter(
      (s) => s.symbol.includes(q) || s.companyName.toUpperCase().includes(q)
    );
    setResults(localMatches); // Show instantly, no waiting

    // --- Phase 2: Server search (debounced 300ms) ---
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      // Only start if query is still what user typed
      if (latestQuery.current !== q) return;
      setIsLoading(true);
      try {
        const remoteResults = await searchStocks(query);
        // Merge: local matches first (with tokens), then server-only results
        if (latestQuery.current !== q) return; // stale response guard
        const mergedMap = new Map();
        localMatches.forEach((s) => mergedMap.set(s.symbol, s));
        if (Array.isArray(remoteResults)) {
          remoteResults.forEach((s) => {
            if (!mergedMap.has(s.symbol)) {
              mergedMap.set(s.symbol, {
                symbol: s.symbol,
                companyName: s.companyName || s.symbol,
                exchange: s.exchange || "NSE",
                type: s.type || "Equity",
                token: s.token || null,
              });
            }
          });
        }
        setResults(Array.from(mergedMap.values()));
      } catch (err) {
        // Keep showing local results on network error
        console.warn("Remote stock search failed:", err.message);
      } finally {
        if (latestQuery.current === q) setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  return { data: results, isLoading };
}