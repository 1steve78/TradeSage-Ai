import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTradingStore from "../store/tradingStore";
import usePortfolioStore from "../store/portfolioStore";
import useMarketStore from "../store/marketStore";
import useWatchlistStore from "../store/watchlistStore";
import { useHistoricalData } from "../hooks/useHistoricalData";
import useStockSearch from "../hooks/useStockSearch";
import { useSocket } from "../context/SocketContext";

import ChartContainer from "../components/Chart/ChartContainer";
import MainChartSeries from "../components/Chart/MainChartSeries";
import VolumeChartSeries from "../components/Chart/VolumeChart";
import ChartToolbar, { AVAILABLE_INDICATORS } from "../components/Chart/ChartToolbar";
import IndicatorSeries from "../components/Chart/IndicatorSeries";
import PriceExplanation from "../components/News/PriceExplanation";
import NewsBulletinBox from "../components/News/NewsBulletinBox";

import {
  Plus,
  Check,
  Share2,
  Building2,
  TrendingUp,
  Brain,
  Layers,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

// Stock catalog definitions for realistic default info
const STOCK_CATALOG = {
  TCS: {
    symbol: "TCS",
    companyName: "Tata Consultancy Services Ltd.",
    exchange: "NSE",
    token: "11536",
    price: 3856.0,
    change: 46.85,
    changePct: 1.23,
    marketCap: "₹14.12T",
    pe: 28.45,
    divYield: "1.25%",
    roe: "39.1%",
    sector: "Technology / IT Services",
    description:
      "Tata Consultancy Services (TCS) is an Indian multinational information technology (IT) services and consulting company headquartered in Mumbai. Part of the Tata Group, operating across 46 countries worldwide.",
    rsi: "62.4 (Neutral)",
    macd: "Bullish Crossover",
    dma50: "₹3,720.50",
    dma200: "₹3,540.20",
    aiInsight:
      "TCS is showing strong momentum following positive Q3 earnings and increased deal wins in the UK market. Technicals suggest a strong support level at ₹3,780. Current price action indicates institutional accumulation.",
    aiConfidence: 85,
  },
  AAPL: {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    exchange: "NASDAQ",
    token: null,
    price: 212.5,
    change: 3.45,
    changePct: 1.65,
    marketCap: "$3.25T",
    pe: 31.2,
    divYield: "0.55%",
    roe: "147.2%",
    sector: "Consumer Electronics / Tech",
    description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.",
    rsi: "58.1 (Neutral)",
    macd: "Bullish Convergence",
    dma50: "$204.30",
    dma200: "$188.90",
    aiInsight:
      "Apple Intelligence rollouts and strong iPhone upgrade cycles present high upside momentum. Support remains firm at $205.",
    aiConfidence: 88,
  },
  SBIN: {
    symbol: "SBIN",
    companyName: "State Bank of India",
    exchange: "NSE",
    token: "3045",
    price: 842.6,
    change: 12.3,
    changePct: 1.48,
    marketCap: "₹7.52T",
    pe: 11.2,
    divYield: "1.63%",
    roe: "18.4%",
    sector: "Banking / Financials",
    description:
      "State Bank of India is an Indian multinational public sector bank and financial services statutory body headquartered in Mumbai. It is the largest bank in India.",
    rsi: "65.2 (Strong)",
    macd: "Bullish Breakout",
    dma50: "₹810.00",
    dma200: "₹745.50",
    aiInsight:
      "SBIN exhibits clean bullish momentum driven by credit growth and healthy NPA reduction. Resistance seen at ₹860.",
    aiConfidence: 90,
  },
  RELIANCE: {
    symbol: "RELIANCE",
    companyName: "Reliance Industries Ltd.",
    exchange: "NSE",
    token: "2885",
    price: 1297.8,
    change: -14.2,
    changePct: -0.47,
    marketCap: "₹20.15T",
    pe: 26.8,
    divYield: "0.34%",
    roe: "9.8%",
    sector: "Energy / Retail / Telecom",
    description:
      "Reliance Industries Limited is an Indian multinational conglomerate, headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications, and media.",
    rsi: "49.5 (Neutral)",
    macd: "Consolidation Phase",
    dma50: "₹1,310.00",
    dma200: "₹1,280.00",
    aiInsight:
      "Jio telecom tariff hikes and retail expansion support long-term valuation, despite temporary energy margin compression.",
    aiConfidence: 82,
  },
  TATAMOTORS: {
    symbol: "TATAMOTORS",
    companyName: "Tata Motors Ltd.",
    exchange: "NSE",
    token: "3456",
    price: 700.0,
    change: 5.0,
    changePct: 0.72,
    marketCap: "₹2.59T",
    pe: 8.5,
    divYield: "0.00%",
    roe: "22.5%",
    sector: "Automobile / Auto Components",
    description: "Tata Motors Limited is an Indian multinational automotive manufacturing company, part of the Tata Group. It manufactures cars, trucks, vans, coaches, buses and military vehicles.",
    rsi: "55.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹680.00",
    dma200: "₹650.00",
    aiInsight: "Tata Motors is benefiting from strong EV adoption in India and Jaguar Land Rover recovery in global markets.",
    aiConfidence: 78,
  },
  INFY: {
    symbol: "INFY",
    companyName: "Infosys Limited",
    exchange: "NSE",
    token: "1594",
    price: 1800.0,
    change: 12.0,
    changePct: 0.67,
    marketCap: "₹7.5T",
    pe: 24.0,
    divYield: "2.10%",
    roe: "32.0%",
    sector: "Technology / IT Services",
    description: "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.",
    rsi: "58.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹1,760.00",
    dma200: "₹1,680.00",
    aiInsight: "Infosys shows strong deal momentum with large client wins in financial services and manufacturing verticals.",
    aiConfidence: 82,
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    companyName: "HDFC Bank Ltd.",
    exchange: "NSE",
    token: "1333",
    price: 1750.0,
    change: 8.5,
    changePct: 0.49,
    marketCap: "₹13.2T",
    pe: 19.5,
    divYield: "1.20%",
    roe: "16.8%",
    sector: "Banking / Financials",
    description: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India's largest private sector bank by assets.",
    rsi: "61.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹1,720.00",
    dma200: "₹1,650.00",
    aiInsight: "HDFC Bank's post-merger integration with HDFC Ltd is progressing well with improving NIMs and deposit growth.",
    aiConfidence: 87,
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    companyName: "ICICI Bank Ltd.",
    exchange: "NSE",
    token: "4963",
    price: 1200.0,
    change: 6.2,
    changePct: 0.52,
    marketCap: "₹8.5T",
    pe: 17.8,
    divYield: "0.80%",
    roe: "17.5%",
    sector: "Banking / Financials",
    description: "ICICI Bank Limited is an Indian multinational bank and financial services company headquartered in Mumbai.",
    rsi: "63.0 (Neutral)",
    macd: "Bullish Crossover",
    dma50: "₹1,165.00",
    dma200: "₹1,080.00",
    aiInsight: "ICICI Bank continues to show strong retail banking growth with improving asset quality.",
    aiConfidence: 85,
  },
  WIPRO: {
    symbol: "WIPRO",
    companyName: "Wipro Limited",
    exchange: "NSE",
    token: "3787",
    price: 550.0,
    change: 3.2,
    changePct: 0.59,
    marketCap: "₹2.88T",
    pe: 22.0,
    divYield: "0.18%",
    roe: "16.5%",
    sector: "Technology / IT Services",
    description: "Wipro Limited is an Indian multinational corporation that provides IT, consulting and business process services.",
    rsi: "52.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹540.00",
    dma200: "₹510.00",
    aiInsight: "Wipro is restructuring its go-to-market strategy with focus on large deals and consulting-led growth.",
    aiConfidence: 73,
  },
  BAJFINANCE: {
    symbol: "BAJFINANCE",
    companyName: "Bajaj Finance Ltd.",
    exchange: "NSE",
    token: "317",
    price: 7500.0,
    change: 45.0,
    changePct: 0.60,
    marketCap: "₹4.6T",
    pe: 35.0,
    divYield: "0.16%",
    roe: "22.0%",
    sector: "Financial Services / NBFC",
    description: "Bajaj Finance Limited is an Indian non-banking financial company which is a subsidiary of Bajaj Finserv.",
    rsi: "59.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹7,200.00",
    dma200: "₹6,800.00",
    aiInsight: "Bajaj Finance maintains strong AUM growth with expanding product portfolio and improving collections efficiency.",
    aiConfidence: 84,
  },
  GODREJIND: {
    symbol: "GODREJIND",
    companyName: "Godrej Industries Ltd.",
    exchange: "NSE",
    token: "10925",
    price: 1317.0,
    change: 8.4,
    changePct: 0.64,
    marketCap: "₹44T",
    pe: 44.6,
    divYield: "0.00%",
    roe: "8.5%",
    sector: "Diversified / Conglomerates",
    description: "Godrej Industries Limited is a conglomerate with business interests spanning chemicals, real estate, consumer products, and agriculture.",
    rsi: "55.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹1,280.00",
    dma200: "₹1,100.00",
    aiInsight: "Godrej Industries benefits from a strong brand portfolio and diversified revenue streams across chemicals and real estate.",
    aiConfidence: 74,
  },
  BHARTIARTL: {
    symbol: "BHARTIARTL",
    companyName: "Bharti Airtel Ltd.",
    exchange: "NSE",
    token: "10604",
    price: 1900.0,
    change: 15.0,
    changePct: 0.80,
    marketCap: "₹11.4T",
    pe: 75.0,
    divYield: "0.37%",
    roe: "14.0%",
    sector: "Telecommunications",
    description: "Bharti Airtel Limited is an Indian multinational telecommunications services company headquartered in New Delhi.",
    rsi: "64.0 (Strong)",
    macd: "Bullish",
    dma50: "₹1,850.00",
    dma200: "₹1,700.00",
    aiInsight: "Airtel's ARPU growth from tariff hikes and 5G rollout positions it well for sustained revenue growth.",
    aiConfidence: 86,
  },
  AXISBANK: {
    symbol: "AXISBANK",
    companyName: "Axis Bank Ltd.",
    exchange: "NSE",
    token: "5900",
    price: 1150.0,
    change: 7.0,
    changePct: 0.61,
    marketCap: "₹3.5T",
    pe: 14.5,
    divYield: "0.09%",
    roe: "18.0%",
    sector: "Banking / Financials",
    description: "Axis Bank Limited is an Indian banking and financial services company headquartered in Mumbai.",
    rsi: "60.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹1,120.00",
    dma200: "₹1,050.00",
    aiInsight: "Axis Bank shows improving margins and asset quality with strong retail banking momentum.",
    aiConfidence: 82,
  },
  KOTAKBANK: {
    symbol: "KOTAKBANK",
    companyName: "Kotak Mahindra Bank Ltd.",
    exchange: "NSE",
    token: "1922",
    price: 2000.0,
    change: 12.0,
    changePct: 0.60,
    marketCap: "₹4.0T",
    pe: 21.0,
    divYield: "0.05%",
    roe: "14.5%",
    sector: "Banking / Financials",
    description: "Kotak Mahindra Bank Limited is an Indian private sector bank headquartered in Mumbai.",
    rsi: "58.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹1,960.00",
    dma200: "₹1,850.00",
    aiInsight: "Kotak Bank continues its quality-first approach with conservative lending and strong liability franchise.",
    aiConfidence: 80,
  },
  SUNPHARMA: {
    symbol: "SUNPHARMA",
    companyName: "Sun Pharmaceutical Industries Ltd.",
    exchange: "NSE",
    token: "3351",
    price: 1800.0,
    change: 10.0,
    changePct: 0.56,
    marketCap: "₹4.3T",
    pe: 33.0,
    divYield: "0.55%",
    roe: "20.0%",
    sector: "Pharmaceuticals",
    description: "Sun Pharmaceutical Industries Limited is an Indian multinational pharmaceutical company headquartered in Mumbai.",
    rsi: "62.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹1,760.00",
    dma200: "₹1,680.00",
    aiInsight: "Sun Pharma's US generics and specialty pipeline are driving strong revenue growth with improving margins.",
    aiConfidence: 83,
  },
  TITAN: {
    symbol: "TITAN",
    companyName: "Titan Company Ltd.",
    exchange: "NSE",
    token: "3506",
    price: 3600.0,
    change: 20.0,
    changePct: 0.56,
    marketCap: "₹3.2T",
    pe: 88.0,
    divYield: "0.28%",
    roe: "30.0%",
    sector: "Consumer Goods / Retail",
    description: "Titan Company Limited is an Indian consumer goods company, a joint venture between Tata Group and the Tamil Nadu Industrial Development Corporation.",
    rsi: "57.0 (Neutral)",
    macd: "Bullish",
    dma50: "₹3,520.00",
    dma200: "₹3,200.00",
    aiInsight: "Titan's jewelry and watches segments continue to grow driven by premiumization and strong brand presence.",
    aiConfidence: 81,
  },
  MARUTI: {
    symbol: "MARUTI",
    companyName: "Maruti Suzuki India Ltd.",
    exchange: "NSE",
    token: "10999",
    price: 12000.0,
    change: 80.0,
    changePct: 0.67,
    marketCap: "₹3.6T",
    pe: 27.0,
    divYield: "1.00%",
    roe: "18.5%",
    sector: "Automobile / Auto Components",
    description: "Maruti Suzuki India Limited is an automobile manufacturer in India. It is a subsidiary of the Japanese corporation Suzuki Motor Corporation.",
    rsi: "57.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹11,800.00",
    dma200: "₹11,200.00",
    aiInsight: "Maruti Suzuki benefits from strong rural demand and new CNG/hybrid product launches in the Indian market.",
    aiConfidence: 80,
  },
  NTPC: {
    symbol: "NTPC",
    companyName: "NTPC Limited",
    exchange: "NSE",
    token: "11630",
    price: 380.0,
    change: 2.5,
    changePct: 0.66,
    marketCap: "₹3.7T",
    pe: 18.0,
    divYield: "1.80%",
    roe: "13.0%",
    sector: "Energy / Power",
    description: "NTPC Limited is an Indian central public sector enterprise and is India's largest energy conglomerate with roots planted way back in 1975.",
    rsi: "60.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹370.00",
    dma200: "₹345.00",
    aiInsight: "NTPC's renewable energy capacity addition and steady thermal operations support dividend sustainability.",
    aiConfidence: 79,
  },
  ADANIENT: {
    symbol: "ADANIENT",
    companyName: "Adani Enterprises Ltd.",
    exchange: "NSE",
    token: "25",
    price: 2800.0,
    change: 18.0,
    changePct: 0.65,
    marketCap: "₹3.2T",
    pe: 85.0,
    divYield: "0.04%",
    roe: "8.5%",
    sector: "Infrastructure / Conglomerates",
    description: "Adani Enterprises Limited is an Indian public conglomerate company headquartered in Ahmedabad, India. It is the flagship company of the Adani Group.",
    rsi: "55.0 (Neutral)",
    macd: "Neutral",
    dma50: "₹2,720.00",
    dma200: "₹2,500.00",
    aiInsight: "Adani Enterprises continues to incubate businesses in green energy, airports and defense with long-term growth potential.",
    aiConfidence: 72,
  },
};

const StockDetailsPage = () => {
  const { symbol: urlSymbol } = useParams();
  const navigate = useNavigate();

  const symbol = (urlSymbol || "TCS").toUpperCase();
  const stockMeta = STOCK_CATALOG[symbol] || {
    symbol,
    companyName: `${symbol} Corporation`,
    exchange: "NSE",   // Default to NSE for Indian stocks
    token: null,
    price: null,       // No fake price — will be resolved from live data
    change: 0,
    changePct: 0,
    marketCap: "N/A",
    pe: null,
    divYield: "N/A",
    roe: "N/A",
    sector: "General Market",
    description: `${symbol} is a publicly traded equity listed on the NSE.`,
    rsi: "N/A",
    macd: "N/A",
    dma50: "N/A",
    dma200: "N/A",
    aiInsight: `${symbol} shows steady price activity with moderate trading volume.`,
    aiConfidence: 75,
  };

  const prices = useMarketStore((state) => state.prices);
  const { selectedStock, selectStock, openBuy, openSell } = useTradingStore();
  const { portfolio, buyStock: executeBuy, sellStock: executeSell } = usePortfolioStore();
  const { isStockInWatchlist, toggleStockInWatchlist } = useWatchlistStore();
  const { joinStockRoom, leaveStockRoom } = useSocket();

  const [timeframe, setTimeframe] = useState("1M");
  const [chartType, setChartType] = useState("candlestick");
  const [selectedIndicators, setSelectedIndicators] = useState(["sma20"]);
  const [orderType, setOrderType] = useState("BUY");
  const [orderCategory, setOrderCategory] = useState("Market Order");
  const [quantity, setQuantity] = useState(10);
  const [orderMessage, setOrderMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Token resolution priority:
  // 1. selectedStock token (set when navigating from search)
  // 2. STOCK_CATALOG token (hardcoded for common stocks)
  // 3. matchedSearch token (async from search API — resolves after first render)
  const resolvedToken =
    (selectedStock?.symbol === symbol && selectedStock?.token)
      ? selectedStock.token
      : (stockMeta.token || matchedSearch?.token || null);

  const rawExchange =
    (selectedStock?.symbol === symbol && selectedStock?.exchange)
      ? selectedStock.exchange
      : (stockMeta.exchange || matchedSearch?.exchange || "NSE");

  // Only pass NSE/BSE as exchange to the Smart API — other exchanges use fallback
  const resolvedExchange = rawExchange === "NSE" || rawExchange === "BSE" ? rawExchange : null;

  // Fetch chart data using resolved exchange and token.
  // IMPORTANT: disabled until token is resolved to prevent fetching mock/fallback data.
  const stockParam = {
    symbol,
    exchange: resolvedExchange,
    token: resolvedToken,
  };

  const { data: responseData, isLoading: loadingChart, error: chartError } = useHistoricalData(
    stockParam,
    timeframe,
    selectedIndicators
  );

  const rawData = responseData?.data || [];
  const indicatorData = responseData?.indicators || {};

  const lastCandle = rawData.length > 0 ? rawData[rawData.length - 1] : null;
  // livePrice may be null if: WebSocket not connected yet, chart still loading, stock not in catalog
  const rawLivePrice = prices[symbol]?.price ?? lastCandle?.close ?? stockMeta.price;
  const priceLoading = rawLivePrice == null; // true when we have no price yet
  const livePrice = rawLivePrice ?? 0;       // safe numeric fallback to prevent .toFixed() crashes
  // Helper: display price as string, or '—' while loading
  const fmt = (val, decimals = 2) => priceLoading ? '—' : Number(val).toFixed(decimals);
  const isSavedInWatchlist = isStockInWatchlist(symbol);


  // Sync selected stock into global store
  useEffect(() => {
    selectStock({ symbol, companyName: stockMeta.companyName, exchange: resolvedExchange, token: resolvedToken });
  }, [symbol, stockMeta.companyName, resolvedExchange, resolvedToken, selectStock]);

  // Subscribe to live market ticks for this specific stock
  useEffect(() => {
    if (symbol && resolvedToken) {
      joinStockRoom(symbol, resolvedToken, resolvedExchange);
      return () => {
        leaveStockRoom(symbol);
      };
    }
  }, [symbol, resolvedToken, resolvedExchange, joinStockRoom, leaveStockRoom]);
  const toggleIndicator = (id) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Order execution logic
  const handleExecuteOrder = async () => {
    if (!quantity || quantity <= 0) return;
    if (priceLoading) {
      setOrderMessage({ type: "error", text: "Market price not available yet. Please wait." });
      return;
    }
    setIsSubmitting(true);
    setOrderMessage(null);
    try {
      if (orderType === "BUY") {
        const res = await executeBuy(symbol, stockMeta.companyName, Number(quantity), livePrice);
        if (res.success) {
          setOrderMessage({ type: "success", text: `Successfully bought ${quantity} shares of ${symbol}!` });
        } else {
          throw new Error(res.error || "Buy order failed");
        }
      } else {
        const res = await executeSell(symbol, stockMeta.companyName, Number(quantity), livePrice);
        if (res.success) {
          setOrderMessage({ type: "success", text: `Successfully sold ${quantity} shares of ${symbol}!` });
        } else {
          throw new Error(res.error || "Sell order failed");
        }
      }
    } catch (err) {
      setOrderMessage({ type: "error", text: err.message || "Order execution failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const estValue = priceLoading ? '—' : (livePrice * Number(quantity || 0)).toFixed(2);
  const estCharges = priceLoading ? '—' : (Number(livePrice * Number(quantity || 0)) * 0.001).toFixed(2);

  return (
    <div className="space-y-lg animate-in fade-in duration-200">
      {/* 1. Asset Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div className="flex items-center gap-md">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-sm">
              <h1 className="font-display-lg text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">
                {symbol}
              </h1>
              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200 uppercase tracking-wide">
                OPEN
              </span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
                {stockMeta.exchange}
              </span>
            </div>
            <p className="text-secondary text-xs sm:text-sm font-medium">{stockMeta.companyName}</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-sm w-full md:w-auto">
          <div className="flex items-baseline gap-sm">
            <span className="font-data-mono text-2xl md:text-3xl font-bold text-[#0f172a]">
              {priceLoading ? '—' : `₹${livePrice.toFixed(2)}`}
            </span>
            <span className="text-green-600 font-data-mono text-sm sm:text-base font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-4 h-4" />
              +{stockMeta.changePct}% (+₹{stockMeta.change.toFixed(2)})
            </span>
          </div>

          <div className="flex items-center gap-md">
            <button
              onClick={() => toggleStockInWatchlist({ symbol, companyName: stockMeta.companyName })}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition shadow-xs ${
                isSavedInWatchlist
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {isSavedInWatchlist ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added to Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" /> Add to Watchlist
                </>
              )}
            </button>

            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="p-1.5 text-secondary border border-outline-variant rounded hover:bg-surface-container transition cursor-pointer"
              title="Copy link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main 12-Column Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* LEFT COLUMN (8 cols): Chart + Technicals + AI Insight + Company Profile */}
        <div className="col-span-12 xl:col-span-8 space-y-gutter">
          {/* Main Chart Section */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-xs overflow-hidden flex flex-col">
            <ChartToolbar 
              chartType={chartType}
              setChartType={setChartType}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              selectedIndicators={selectedIndicators}
              toggleIndicator={toggleIndicator}
            />
            <div className="border-t border-outline-variant/30 flex-1 relative">
              <ChartContainer
                loading={loadingChart}
                error={chartError ? "Historical data unavailable" : null}
              >
                <MainChartSeries data={rawData} type={chartType} />
                {selectedIndicators.map((indId) => {
                  const config = AVAILABLE_INDICATORS.find((i) => i.id === indId);
                  return config ? (
                    <IndicatorSeries
                      key={indId}
                      data={indicatorData[indId] || []}
                      color={config.color}
                    />
                  ) : null;
                })}
                <VolumeChartSeries data={rawData} />
              </ChartContainer>
            </div>
          </div>

          {/* Technical Analysis & AI Insight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Technical Analysis Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs">
              <h3 className="font-label-caps text-xs text-[#0f172a] font-bold mb-md flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-primary" /> Technical Analysis
              </h3>
              <div className="space-y-sm text-xs font-medium">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/40">
                  <span className="text-secondary">RSI (14)</span>
                  <span className="font-data-mono font-bold text-slate-800">{stockMeta.rsi}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/40">
                  <span className="text-secondary">MACD</span>
                  <span className="font-data-mono font-bold text-green-600">{stockMeta.macd}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/40">
                  <span className="text-secondary">50 DMA</span>
                  <span className="font-data-mono font-bold text-slate-800">{stockMeta.dma50}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-secondary">200 DMA</span>
                  <span className="font-data-mono font-bold text-slate-800">{stockMeta.dma200}</span>
                </div>
              </div>
            </div>

            {/* TradeSage AI Insight Card */}
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs border-l-4 border-l-primary flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-sm">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                    TradeSage AI Insight
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  "{stockMeta.aiInsight}"
                </p>
              </div>

              <div className="mt-md pt-3 border-t border-outline-variant/30 flex items-center gap-sm">
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                  Confidence: {stockMeta.aiConfidence}%
                </span>
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${stockMeta.aiConfidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Price Movement Explainer Widget */}
          <PriceExplanation symbol={symbol} priceChange={`+${stockMeta.changePct}%`} />

          {/* Company Profile Card */}
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs">
            <h3 className="font-label-caps text-xs text-[#0f172a] font-bold mb-md uppercase tracking-wider">
              Company Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-lg">
              <div className="p-3 bg-surface-container-low rounded">
                <div className="text-[10px] text-secondary uppercase font-bold mb-1">Market Cap</div>
                <div className="font-data-mono text-sm font-bold text-[#0f172a]">{stockMeta.marketCap}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded">
                <div className="text-[10px] text-secondary uppercase font-bold mb-1">P/E Ratio</div>
                <div className="font-data-mono text-sm font-bold text-[#0f172a]">{stockMeta.pe}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded">
                <div className="text-[10px] text-secondary uppercase font-bold mb-1">Div. Yield</div>
                <div className="font-data-mono text-sm font-bold text-[#0f172a]">{stockMeta.divYield}</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded">
                <div className="text-[10px] text-secondary uppercase font-bold mb-1">ROE</div>
                <div className="font-data-mono text-sm font-bold text-[#0f172a]">{stockMeta.roe}</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {stockMeta.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Live Order Form + News + Market Depth */}
        <div className="col-span-12 xl:col-span-4 space-y-gutter">
          {/* Live Order Trading Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-xs overflow-hidden">
            {/* BUY / SELL Tabs */}
            <div className="flex border-b border-outline-variant text-xs">
              <button
                onClick={() => setOrderType("BUY")}
                className={`flex-1 py-3.5 font-bold transition-all cursor-pointer ${
                  orderType === "BUY"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-surface-container-low text-slate-600 hover:bg-slate-200"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setOrderType("SELL")}
                className={`flex-1 py-3.5 font-bold transition-all cursor-pointer ${
                  orderType === "SELL"
                    ? "bg-rose-600 text-white font-bold"
                    : "bg-surface-container-low text-slate-600 hover:bg-slate-200"
                }`}
              >
                SELL
              </button>
            </div>

            <div className="p-lg space-y-md">
              {orderMessage && (
                <div
                  className={`p-3 rounded text-xs font-bold flex items-center gap-2 ${
                    orderMessage.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>{orderMessage.text}</span>
                </div>
              )}

              <div>
                <label className="text-[10px] uppercase font-bold text-secondary mb-1 block">
                  Order Type
                </label>
                <select
                  value={orderCategory}
                  onChange={(e) => setOrderCategory(e.target.value)}
                  className="w-full border border-outline-variant focus:border-primary focus:ring-0 rounded p-2 text-xs font-bold text-[#0f172a] outline-none"
                >
                  <option>Market Order</option>
                  <option>Limit Order</option>
                  <option>Stop Loss Order</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="text-[10px] uppercase font-bold text-secondary mb-1 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-outline-variant focus:border-primary focus:ring-0 rounded p-2 font-data-mono text-xs text-[#0f172a] font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-secondary mb-1 block">
                    Market Price
                  </label>
                  <input
                    type="text"
                    disabled
                    value={priceLoading ? '—' : `₹${livePrice.toFixed(2)}`}
                    className="w-full border border-outline-variant bg-surface-container-low rounded p-2 font-data-mono text-xs text-slate-500 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="py-md border-t border-outline-variant/60 space-y-1.5 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-secondary">Est. Trade Value</span>
                  <span className="font-data-mono font-bold text-[#0f172a]">₹{estValue}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Charges & Taxes</span>
                  <span className="font-data-mono">₹{estCharges}</span>
                </div>
              </div>

              <button
                onClick={handleExecuteOrder}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded font-bold text-xs uppercase tracking-wider text-white transition shadow-sm cursor-pointer ${
                  orderType === "BUY"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isSubmitting ? "Executing Order..." : `Execute ${orderType} Order`}
              </button>

              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider">
                Virtual Cash Balance: ₹{(portfolio?.cash ?? 1000000).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Institutional Stock News Experience */}
          <NewsBulletinBox symbol={symbol} />

          {/* Market Depth Order Book */}
          <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded shadow-xs">
            <h3 className="font-label-caps text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-md">
              Market Depth
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                <span>BID</span>
                <span>ASK</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-data-mono">
                <div className="flex-1 flex justify-between px-2 py-1 bg-green-50/70 border-l-2 border-green-500">
                  <span>{fmt(livePrice - 0.05)}</span>
                  <span className="text-green-700 font-bold">124</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">89</span>
                  <span>{fmt(livePrice + 0.05)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-data-mono">
                <div className="flex-1 flex justify-between px-2 py-1 bg-green-50/70 border-l-2 border-green-500">
                  <span>{fmt(livePrice - 0.10)}</span>
                  <span className="text-green-700 font-bold">452</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">210</span>
                  <span>{fmt(livePrice + 0.10)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-data-mono opacity-60">
                <div className="flex-1 flex justify-between px-2 py-1 bg-green-50/70 border-l-2 border-green-500">
                  <span>{fmt(livePrice - 0.15)}</span>
                  <span className="text-green-700 font-bold">98</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">341</span>
                  <span>{fmt(livePrice + 0.15)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsPage;
