import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTradingStore from "../store/tradingStore";
import usePortfolioStore from "../store/portfolioStore";
import useMarketStore from "../store/marketStore";
import useWatchlistStore from "../store/watchlistStore";
import { useHistoricalData } from "../hooks/useHistoricalData";

import ChartContainer from "../components/Chart/ChartContainer";
import CandlestickChartSeries from "../components/Chart/CandlestickChart";
import VolumeChartSeries from "../components/Chart/VolumeChart";
import TimeframeSelector from "../components/Chart/TimeframeSelector";
import IndicatorSelector, { AVAILABLE_INDICATORS } from "../components/Chart/IndicatorSelector";
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
};

const StockDetailsPage = () => {
  const { symbol: urlSymbol } = useParams();
  const navigate = useNavigate();

  const symbol = (urlSymbol || "TCS").toUpperCase();
  const stockMeta = STOCK_CATALOG[symbol] || {
    symbol,
    companyName: `${symbol} Corporation`,
    exchange: "EQUITY",
    token: null,
    price: 150.0,
    change: 2.1,
    changePct: 1.42,
    marketCap: "$100B",
    pe: 22.0,
    divYield: "1.00%",
    roe: "15.0%",
    sector: "General Market",
    description: `${symbol} is a publicly traded asset available on global exchanges for paper and live trading.`,
    rsi: "52.0 (Neutral)",
    macd: "Neutral",
    dma50: "145.00",
    dma200: "135.00",
    aiInsight: `${symbol} shows steady price activity with moderate trading volume.`,
    aiConfidence: 75,
  };

  const prices = useMarketStore((state) => state.prices);
  const { selectStock, openBuy, openSell } = useTradingStore();
  const { portfolio, buyStock: executeBuy, sellStock: executeSell } = usePortfolioStore();
  const { isStockInWatchlist, toggleStockInWatchlist } = useWatchlistStore();

  const [timeframe, setTimeframe] = useState("1M");
  const [selectedIndicators, setSelectedIndicators] = useState(["sma20"]);
  const [orderType, setOrderType] = useState("BUY");
  const [orderCategory, setOrderCategory] = useState("Market Order");
  const [quantity, setQuantity] = useState(10);
  const [orderMessage, setOrderMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch chart data
  const stockParam = {
    symbol,
    exchange: stockMeta.exchange === "NSE" ? "NSE" : null,
    token: stockMeta.token || null,
  };

  const { data: responseData, isLoading: loadingChart, error: chartError } = useHistoricalData(
    stockParam,
    timeframe,
    selectedIndicators
  );

  const rawData = responseData?.data || [];
  const indicatorData = responseData?.indicators || {};

  const lastCandle = rawData.length > 0 ? rawData[rawData.length - 1] : null;
  const livePrice = prices[symbol]?.price ?? lastCandle?.close ?? stockMeta.price;
  const isSavedInWatchlist = isStockInWatchlist(symbol);

  // Sync selected stock into global store
  useEffect(() => {
    selectStock({ symbol, companyName: stockMeta.companyName });
  }, [symbol, stockMeta.companyName, selectStock]);


  const toggleIndicator = (id) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Order execution logic
  const handleExecuteOrder = async () => {
    if (!quantity || quantity <= 0) return;
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

  const estValue = (livePrice * Number(quantity || 0)).toFixed(2);
  const estCharges = (Number(estValue) * 0.001).toFixed(2);

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
              ₹{livePrice.toFixed(2)}
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
          {/* Main Candlestick Chart */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded shadow-xs overflow-hidden">
            <IndicatorSelector selectedIndicators={selectedIndicators} onToggle={toggleIndicator} />
            <ChartContainer
              headerLeft={
                <span className="font-title-sm text-sm text-[#0f172a] font-bold">
                  {stockMeta.companyName} ({symbol})
                </span>
              }
              headerRight={
                <TimeframeSelector
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  timeframes={["1D", "1W", "1M", "1Y"]}
                />
              }
              loading={loadingChart}
              error={chartError ? "Historical data unavailable" : null}
            >
              <CandlestickChartSeries data={rawData} />
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
                    value={`₹${livePrice.toFixed(2)}`}
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
                  <span>{(livePrice - 0.05).toFixed(2)}</span>
                  <span className="text-green-700 font-bold">124</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">89</span>
                  <span>{(livePrice + 0.05).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-data-mono">
                <div className="flex-1 flex justify-between px-2 py-1 bg-green-50/70 border-l-2 border-green-500">
                  <span>{(livePrice - 0.10).toFixed(2)}</span>
                  <span className="text-green-700 font-bold">452</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">210</span>
                  <span>{(livePrice + 0.10).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-data-mono opacity-60">
                <div className="flex-1 flex justify-between px-2 py-1 bg-green-50/70 border-l-2 border-green-500">
                  <span>{(livePrice - 0.15).toFixed(2)}</span>
                  <span className="text-green-700 font-bold">98</span>
                </div>
                <div className="flex-1 flex justify-between px-2 py-1 bg-red-50/70 border-r-2 border-red-500">
                  <span className="text-red-700 font-bold">341</span>
                  <span>{(livePrice + 0.15).toFixed(2)}</span>
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
