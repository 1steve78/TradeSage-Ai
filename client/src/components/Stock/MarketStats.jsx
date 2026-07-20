import useMarketStore from "../../store/marketStore";

const MarketStats = ({ stock, info, isLoading }) => {
  const prices = useMarketStore((state) => state.prices);
  
  if (isLoading) {
    return (
      <div className="bg-white border border-[#e2e8f0] p-md rounded mb-md animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stock) return null;

  const symbol = stock.symbol;
  const livePriceData = prices[symbol];
  const currentPrice = livePriceData?.price ?? null;
  
  // Dynamically calculate metrics based on live price for high fidelity (mocking real market depth)
  const openVal = currentPrice ? currentPrice * 0.995 : 0;
  const prevCloseVal = currentPrice ? currentPrice * 0.992 : 0;
  const highVal = currentPrice ? Math.max(currentPrice, openVal) * 1.008 : 0;
  const lowVal = currentPrice ? Math.min(currentPrice, openVal) * 0.991 : 0;
  
  // High/Low for 52W mock
  const high52 = currentPrice ? currentPrice * 1.25 : 0;
  const low52 = currentPrice ? currentPrice * 0.75 : 0;

  // Static metrics based on ticker symbol if missing from info
  const getVolume = (sym) => {
    if (sym === "AAPL") return "4.2M";
    if (sym === "TSLA") return "12.8M";
    if (sym === "NVDA") return "22.4M";
    if (sym === "MSFT") return "5.1M";
    if (sym === "BTC") return "84K";
    return "1.5M";
  };

  const formatMarketCap = (mc) => {
    if (!mc) return "--";
    if (mc >= 1e12) return `₹${(mc / 1e12).toFixed(2)}T`;
    if (mc >= 1e9) return `₹${(mc / 1e9).toFixed(2)}B`;
    if (mc >= 1e6) return `₹${(mc / 1e6).toFixed(2)}M`;
    return `₹${mc.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-[#e2e8f0] p-md rounded mb-md">
      <div className="grid grid-cols-2 gap-y-2 gap-x-gutter text-xs font-semibold text-slate-600">
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">Open</span>
          <span className="font-data-mono text-[#0f172a]">{openVal ? `₹${openVal.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">Prev Close</span>
          <span className="font-data-mono text-[#0f172a]">{prevCloseVal ? `₹${prevCloseVal.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">High</span>
          <span className="font-data-mono text-green-600">{highVal ? `₹${highVal.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">Low</span>
          <span className="font-data-mono text-red-600">{lowVal ? `₹${lowVal.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">Volume</span>
          <span className="font-data-mono text-[#0f172a]">{getVolume(symbol)}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">Mkt Cap</span>
          <span className="font-data-mono text-[#0f172a]">{info?.marketCap ? formatMarketCap(info.marketCap) : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">52W High</span>
          <span className="font-data-mono text-[#0f172a]">{high52 ? `₹${high52.toFixed(2)}` : "--"}</span>
        </div>
        <div className="flex justify-between border-b border-outline-variant/20 border-dotted pb-1.5">
          <span className="text-slate-400 text-[11px]">52W Low</span>
          <span className="font-data-mono text-[#0f172a]">{low52 ? `₹${low52.toFixed(2)}` : "--"}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
