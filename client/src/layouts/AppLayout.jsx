import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useMarketStore from "../store/marketStore";
import PriorityWatchlist from "../components/Dashboard/PriorityWatchlist";
import TradeModal from "../components/Trading/TradeModal";

function AppLayout() {
  const { user } = useAuthStore();
  const prices = useMarketStore((state) => state.prices);
  const [darkMode, setDarkMode] = useState(false);

  // Live prices for marquee ticker tape
  const getLivePrice = (symbol, defaultVal) => {
    const liveVal = prices[symbol]?.price;
    if (liveVal) return `₹${liveVal.toFixed(2)}`;
    return `₹${defaultVal}`;
  };

  const getLiveChange = (symbol, defaultPct) => {
    const liveData = prices[symbol];
    if (liveData && liveData.previousPrice) {
      const diff = liveData.price - liveData.previousPrice;
      const pct = (diff / liveData.previousPrice) * 100;
      return `${diff >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
    }
    return defaultPct;
  };

  const isLiveUp = (symbol) => {
    const liveData = prices[symbol];
    if (liveData && liveData.previousPrice) {
      return liveData.price >= liveData.previousPrice;
    }
    return true;
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8FAFC] text-[#191c1e] antialiased select-none font-sans">
      {/* TopNavBar */}
      <header className="flex justify-between items-center px-lg py-xs w-full bg-white border-b border-outline-variant z-40">
        <div className="flex items-center gap-xl">
          <NavLink to="/dashboard" className="font-display-lg text-lg font-bold text-primary tracking-tighter">
            TradeSage AI
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-md items-center font-body-md text-xs font-semibold">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1.5 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary font-bold" : "text-slate-500 hover:text-primary"
                }`
              }
            >
              Terminal
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `px-3 py-1.5 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary font-bold" : "text-slate-500 hover:text-primary"
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-3 py-1.5 transition-colors ${
                  isActive ? "text-primary border-b-2 border-primary font-bold" : "text-slate-500 hover:text-primary"
                }`
              }
            >
              Orders
            </NavLink>
          </div>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-md">
          {/* Live indicator badge */}
          <div className="flex items-center gap-xs px-sm py-1 bg-surface-container-low rounded border border-outline-variant">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot"></div>
            <span className="font-label-caps text-[9px] text-secondary uppercase tracking-widest font-bold">Live</span>
          </div>

          <div className="flex items-center gap-sm">
            <button className="p-1.5 hover:bg-surface-container-low rounded transition-colors text-slate-500 hover:text-[#0f172a] cursor-pointer" title="Notifications">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <button className="p-1.5 hover:bg-surface-container-low rounded transition-colors text-slate-500 hover:text-[#0f172a] cursor-pointer" title="Settings">
              <span className="material-symbols-outlined text-lg">settings</span>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-1.5 hover:bg-surface-container-low rounded transition-colors text-slate-500 hover:text-[#0f172a] cursor-pointer" 
              title="Theme Toggle"
            >
              <span className="material-symbols-outlined text-lg">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>
            
            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <h4 className="text-[10px] font-bold text-[#0f172a] leading-none uppercase">
                  {user?.name || "ALEXANDER_V"}
                </h4>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                  Institutional
                </span>
              </div>
              <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer font-bold text-xs uppercase shadow-sm">
                {user?.name ? user.name.slice(0, 2) : "AV"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Ticker Marquee */}
      <div className="w-full bg-primary py-1 overflow-hidden border-b border-black">
        <div className="ticker-scroll flex items-center gap-lg">
          {/* Double repeat for seamless infinite loop */}
          <div className="flex items-center gap-lg text-white font-data-mono text-xs whitespace-nowrap">
            <span>NIFTY 50 <span className="text-green-400">22,123.45 (+0.45%)</span></span>
            <span>SENSEX <span className="text-green-400">72,450.90 (+0.38%)</span></span>
            <span>AAPL <span className={isLiveUp("AAPL") ? "text-green-400" : "text-red-400"}>{getLivePrice("AAPL", "212.50")} ({getLiveChange("AAPL", "+0.00%")})</span></span>
            <span>TSLA <span className={isLiveUp("TSLA") ? "text-green-400" : "text-red-400"}>{getLivePrice("TSLA", "301.20")} ({getLiveChange("TSLA", "+0.00%")})</span></span>
            <span>NVDA <span className={isLiveUp("NVDA") ? "text-green-400" : "text-red-400"}>{getLivePrice("NVDA", "182.60")} ({getLiveChange("NVDA", "+0.00%")})</span></span>
            <span>BTC/USD <span className={isLiveUp("BTC") ? "text-green-400" : "text-red-400"}>{getLivePrice("BTC", "67284.10")} ({getLiveChange("BTC", "+0.00%")})</span></span>
          </div>
          <div className="flex items-center gap-lg text-white font-data-mono text-xs whitespace-nowrap">
            <span>NIFTY 50 <span className="text-green-400">22,123.45 (+0.45%)</span></span>
            <span>SENSEX <span className="text-green-400">72,450.90 (+0.38%)</span></span>
            <span>AAPL <span className={isLiveUp("AAPL") ? "text-green-400" : "text-red-400"}>{getLivePrice("AAPL", "212.50")} ({getLiveChange("AAPL", "+0.00%")})</span></span>
            <span>TSLA <span className={isLiveUp("TSLA") ? "text-green-400" : "text-red-400"}>{getLivePrice("TSLA", "301.20")} ({getLiveChange("TSLA", "+0.00%")})</span></span>
            <span>NVDA <span className={isLiveUp("NVDA") ? "text-green-400" : "text-red-400"}>{getLivePrice("NVDA", "182.60")} ({getLiveChange("NVDA", "+0.00%")})</span></span>
            <span>BTC/USD <span className={isLiveUp("BTC") ? "text-green-400" : "text-red-400"}>{getLivePrice("BTC", "67284.10")} ({getLiveChange("BTC", "+0.00%")})</span></span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Watchlist Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant overflow-y-auto">
          <PriorityWatchlist />
        </aside>

        {/* Content Outlet Canvas */}
        <main className="flex-1 overflow-y-auto p-gutter bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>

      {/* Compliance & Latency Footer */}
      <footer className="flex justify-between items-center px-lg py-md w-full bg-white border-t border-outline-variant z-40 text-xs">
        <div className="flex items-center gap-lg">
          <span className="font-label-caps text-[9px] text-[#0f172a] font-bold uppercase tracking-wider">
            TradeSage Institutional
          </span>
          <div className="hidden sm:flex gap-md text-slate-500 font-semibold">
            <a className="hover:text-primary underline decoration-transparent hover:decoration-primary transition" href="#">API Docs</a>
            <a className="hover:text-primary underline decoration-transparent hover:decoration-primary transition" href="#">System Status</a>
            <a className="hover:text-primary underline decoration-transparent hover:decoration-primary transition" href="#">Privacy Policy</a>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <span className="font-data-mono text-[10px] text-slate-500">Latency: 12ms</span>
          </div>
          <p className="text-slate-400 font-medium">© 2026 TradeSage Institutional. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Global Trade Modal */}
      <TradeModal />
    </div>
  );
}

export default AppLayout;
