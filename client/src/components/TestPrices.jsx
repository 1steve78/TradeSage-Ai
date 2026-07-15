import { useEffect, useRef, useState } from "react";
import useMarketStore from "../store/marketStore";

const COMPANY_NAMES = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corp.",
  NVDA: "NVIDIA Corp.",
  TSLA: "Tesla, Inc.",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com, Inc.",
};

const LivePriceCard = ({ symbol, price }) => {
  const [flash, setFlash] = useState(null);
  const initialPriceRef = useRef(price);
  const prevPriceRef = useRef(price);

  useEffect(() => {
    // If the initial price wasn't set, set it now
    if (initialPriceRef.current === null || initialPriceRef.current === undefined) {
      initialPriceRef.current = price;
    }

    if (prevPriceRef.current !== null && prevPriceRef.current !== undefined) {
      if (price > prevPriceRef.current) {
        setFlash("up");
        const timer = setTimeout(() => setFlash(null), 300);
        return () => clearTimeout(timer);
      } else if (price < prevPriceRef.current) {
        setFlash("down");
        const timer = setTimeout(() => setFlash(null), 300);
        return () => clearTimeout(timer);
      }
    }
    prevPriceRef.current = price;
  }, [price]);

  const initialPrice = initialPriceRef.current || price;
  const change = price - initialPrice;
  const changePercent = initialPrice > 0 ? (change / initialPrice) * 100 : 0;
  const companyName = COMPANY_NAMES[symbol] || "Stock Symbol";

  return (
    <div
      className={`rounded-2xl border bg-slate-900/50 p-4 transition-all duration-300 hover:bg-slate-900/70 hover:scale-[1.02] ${
        flash === "up"
          ? "border-emerald-500/55 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          : flash === "down"
          ? "border-rose-500/55 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
          : "border-white/10"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-white tracking-wider text-base">
            {symbol}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate max-w-[120px]">
            {companyName}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            change >= 0
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {change >= 0 ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>

      <div className="mt-4 flex justify-between items-baseline">
        <p className="font-mono text-xl font-bold text-white tracking-tight">
          ${price.toFixed(2)}
        </p>
        <p
          className={`font-mono text-xs font-semibold ${
            change >= 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

const TestPrices = () => {
  const pricesMap = useMarketStore((state) => state.prices);
  const connected = useMarketStore((state) => state.connected);

  const priceList = Object.values(pricesMap);

  if (!connected && priceList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-slate-900/20 rounded-2xl text-center">
        <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-400 text-sm font-medium">Connecting to live market server...</p>
      </div>
    );
  }

  if (priceList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-white/5 bg-slate-900/20 rounded-2xl text-center animate-pulse">
        <p className="text-slate-400 text-sm font-medium">Awaiting first market price update...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {priceList.map((stock) => (
        <LivePriceCard
          key={stock.symbol}
          symbol={stock.symbol}
          price={stock.price}
        />
      ))}
    </div>
  );
};

export default TestPrices;