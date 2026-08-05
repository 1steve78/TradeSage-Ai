import { useState, useEffect, useMemo, memo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import useMarketStore from "../../store/marketStore";

// MarketRow component wrapped in React.memo for high-performance tick updates
const MarketRow = memo(({ item }) => {
  const livePriceData = useMarketStore(state => state.prices[item.symbol]);
  const price = livePriceData?.price || item.price;
  const change = livePriceData?.change || item.change || 0;
  
  // Format price with INR standard (e.g. ₹2,845.60)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);

  return (
    <Link 
      to={`/stock/${item.symbol}`}
      className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-surface-low border border-gray-100 flex items-center justify-center overflow-hidden relative shadow-sm">
          <img 
            src={`https://assets-netstorage.groww.in/stock-assets/logos/GSTK${item.symbol}.png`}
            alt={item.symbol}
            className="w-full h-full object-contain p-1 z-10 bg-white"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 hidden items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-50">
            {item.symbol.slice(0, 2)}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-brand group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
            {item.symbol}
            <span className="px-1 py-[1px] bg-slate-100 border border-slate-200 text-slate-500 rounded-[3px] text-[8px] font-bold tracking-wider">
              {item.exchange || "NSE"}
            </span>
          </div>
          <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{item.companyName || item.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-bold text-brand">{formattedPrice}</div>
        <div className={`text-[10px] font-bold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.symbol === nextProps.item.symbol;
});

const SkeletonRow = () => (
  <div className="flex items-center justify-between p-2 -mx-2 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      <div>
        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
        <div className="h-2 w-24 bg-gray-100 rounded"></div>
      </div>
    </div>
    <div className="text-right">
      <div className="h-3 w-16 bg-gray-200 rounded mb-1 ml-auto"></div>
      <div className="h-2 w-10 bg-gray-100 rounded ml-auto"></div>
    </div>
  </div>
);

export default function MarketWidget() {
  const [activeTab, setActiveTab] = useState("trending");
  const [moversData, setMoversData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { joinStockRoom, leaveStockRoom } = useSocket();

  // Fetch movers data
  useEffect(() => {
    const fetchMovers = async () => {
      try {
        // Debounce fetching heavily since it's cached on backend anyway
        const res = await axios.get("http://localhost:5000/api/market/movers", { withCredentials: true });
        if (res.data?.success) {
          setMoversData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load market movers:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovers();
    // Poll every 30 seconds
    const interval = setInterval(fetchMovers, 30000);
    return () => clearInterval(interval);
  }, []);

  const visibleList = useMemo(() => {
    if (!moversData) return [];
    return moversData[activeTab] || [];
  }, [moversData, activeTab]);

  // Manage targeted WebSocket subscriptions
  useEffect(() => {
    if (visibleList.length === 0) return;

    // Join rooms for visible stocks
    visibleList.forEach(item => {
      if (item.symbol && item.token) {
        joinStockRoom(item.symbol, item.token, item.exchange || "NSE");
      }
    });

    // Cleanup: leave rooms when unmounting or switching tabs
    return () => {
      visibleList.forEach(item => {
        if (item.symbol) leaveStockRoom(item.symbol);
      });
    };
  }, [visibleList, joinStockRoom, leaveStockRoom]);

  // Check market hours (Mon-Fri, 9:15 AM - 3:30 PM IST)
  const isMarketOpen = useMemo(() => {
    const now = new Date();
    // Convert current time to IST
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const day = istTime.getDay();
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    
    const isWeekday = day >= 1 && day <= 5;
    const isAfterOpen = (hours === 9 && minutes >= 15) || hours > 9;
    const isBeforeClose = (hours === 15 && minutes <= 30) || hours < 15;
    
    return isWeekday && isAfterOpen && isBeforeClose;
  }, []);

  const tabs = [
    { id: "trending", label: "Trending" },
    { id: "gainers", label: "Gainers" },
    { id: "losers", label: "Losers" },
    { id: "indexes", label: "Indexes" },
  ];

  return (
    <section className="bg-white rounded-custom p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-brand leading-none">Market</h2>
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 shadow-sm"
            title={isMarketOpen ? "Market is Open" : "Market is Closed"}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isMarketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              {isMarketOpen ? "Live" : "Closed"}
            </span>
          </div>
        </div>
        <Link to="/market" className="text-sm font-semibold text-blue-600 hover:underline">View all</Link>
      </div>

      <div className="flex bg-surface-low rounded-lg p-1 mb-6 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white text-brand shadow-sm"
                : "text-gray-500 hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : visibleList.length > 0 ? (
          <div className="space-y-1">
          {visibleList.map((item) => (
            <MarketRow 
              key={item.symbol} 
              item={item} 
            />
          ))}
        </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-400">
            No market data available.
          </div>
        )}
      </div>
    </section>
  );
}
