import { loadInstruments } from "./marketService.js";
import { ensureSession } from "./smartApiService.js";

// Cache structure
let moversCache = {
  trending: [],
  gainers: [],
  losers: [],
  indexes: [],
  lastUpdated: null,
};

// Top 50 liquid NSE stocks & Indexes
const MONITORED_SYMBOLS = [
  "NIFTY 50", "NIFTY BANK", // Indexes
  "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "INFY", "ITC", 
  "SBIN", "BHARTIARTL", "KOTAKBANK", "L&T", "AXISBANK", "HINDUNILVR",
  "BAJFINANCE", "ASIANPAINT", "MARUTI", "SUNPHARMA", "TITAN",
  "TATASTEEL", "ULTRACEMCO", "NTPC", "M&M", "POWERGRID", "WIPRO",
  "NESTLEIND", "ONGC", "HCLTECH", "JSWSTEEL", "TATMOTO", "TECHM",
  "GRASIM", "HINDALCO", "BAJAJFINSV", "INDUSINDBK", "ADANIPORTS",
  "BRITANNIA", "CIPLA", "EICHERMOT", "DIVISLAB", "DRREDDY",
  "APOLLOHOSP", "HEROMOTOCO", "TATACONSUM", "UPL", "COALINDIA",
  "BPCL", "SHREECEM", "BAJAJ-AUTO"
];

// Helper to resolve symbols to tokens
let tokenMap = null;

const resolveTokens = async () => {
  const instruments = await loadInstruments();
  tokenMap = {};
  
  for (const symbol of MONITORED_SYMBOLS) {
    if (symbol === "NIFTY 50") {
      tokenMap[symbol] = { token: "26000", exchange: "NSE" };
    } else if (symbol === "NIFTY BANK") {
      tokenMap[symbol] = { token: "26009", exchange: "NSE" };
    } else {
      const inst = instruments.find(i => i.name === symbol && i.exch_seg === "NSE");
      if (inst) {
        tokenMap[symbol] = { token: inst.token, exchange: "NSE" };
      }
    }
  }
};

export const computeMarketMovers = async () => {
  try {
    if (!tokenMap) await resolveTokens();
    const smartApi = await ensureSession();
    
    const tokens = Object.values(tokenMap).map(v => v.token);
    if (!tokens.length) return;

    // SmartAPI marketData supports array of tokens
    const response = await smartApi.marketData({
      mode: "LTP",
      exchangeTokens: {
        "NSE": tokens
      }
    });

    if (!response || !response.status || !response.data || !response.data.fetched) {
      console.warn("[marketCronService] Failed to fetch bulk LTP for market movers.");
      return;
    }

    const fetched = response.data.fetched;
    const computedData = [];

    // Map fetched tokens back to our symbol names and compute change
    const tokenToSymbol = Object.entries(tokenMap).reduce((acc, [sym, data]) => {
      acc[data.token] = sym;
      return acc;
    }, {});

    fetched.forEach((item) => {
      const symbol = tokenToSymbol[item.symbolToken];
      if (!symbol) return;
      
      const ltp = parseFloat(item.ltp);
      let close = parseFloat(item.close);
      if (isNaN(close) || close <= 0) close = ltp; // Fallback
      
      let change = 0;
      if (close > 0) {
        change = ((ltp - close) / close) * 100;
      }

      computedData.push({
        symbol,
        token: item.symbolToken,
        exchange: item.exchange || "NSE",
        price: ltp,
        change: parseFloat(change.toFixed(2)),
      });
    });

    // Indexes
    const indexes = computedData.filter(d => d.symbol === "NIFTY 50" || d.symbol === "NIFTY BANK");
    
    // Equities
    const equities = computedData.filter(d => d.symbol !== "NIFTY 50" && d.symbol !== "NIFTY BANK");

    // Gainers
    const gainers = [...equities].sort((a, b) => b.change - a.change).slice(0, 5);
    
    // Losers
    const losers = [...equities].sort((a, b) => a.change - b.change).slice(0, 5);
    
    // Trending (absolute highest changes, mimicking high volatility/activity)
    const trending = [...equities].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

    moversCache = {
      trending,
      gainers,
      losers,
      indexes,
      lastUpdated: Date.now(),
    };

  } catch (error) {
    console.error("[marketCronService] Error updating market movers:", error.message);
  }
};

let cronInterval = null;

export const startMarketCron = () => {
  if (cronInterval) return;
  console.log("[marketCronService] Starting market movers cron (30s interval)...");
  
  // Run immediately
  computeMarketMovers();
  
  // Schedule every 30 seconds
  cronInterval = setInterval(computeMarketMovers, 30000);
};

export const getMarketMovers = () => {
  return moversCache;
};
