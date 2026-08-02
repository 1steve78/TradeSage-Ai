import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useMarketStore from "../store/marketStore";
import usePortfolioStore from "../store/portfolioStore";
import TradeModal from "../components/Trading/TradeModal";
import AIChat from "../components/AI/AIChat/AIChat";
import GlobalSearchModal from "../components/SearchBar/GlobalSearchModal";
import NotificationBell from "../components/Notifications/NotificationBell";
import { Bot, Sparkles, Search, LayoutDashboard, TrendingUp, Briefcase, BrainCircuit, Calendar as CalendarIcon, Settings, Sun, Moon, ChevronLeft, ChevronRight, Wallet, Activity, Star, ClipboardList, BarChart2 } from "lucide-react";

function AppLayout() {
  const { user } = useAuthStore();
  const { portfolio } = usePortfolioStore();
  const prices = useMarketStore((state) => state.prices);
  
  const [darkMode, setDarkMode] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Global Keyboard Listener for Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Mock calculation for live balance to match the UI
  const totalBalance = portfolio?.cashBalance || 15901.24;

  return (
    <div className="flex min-h-screen bg-surface font-sans">
      {/* Main Dashboard Wrapper */}
      <main className="w-full h-screen flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className={`hidden md:flex flex-col border-r border-gray-100 bg-surface-lowest p-4 lg:p-6 z-20 transition-all duration-300 relative ${isCollapsed ? "w-24 items-center" : "w-64"}`}>
          
          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 bg-white border border-gray-200 text-gray-400 hover:text-brand hover:border-gray-300 rounded-full p-1 shadow-sm z-30 transition-all cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className={`flex items-center mb-10 ${isCollapsed ? "justify-center" : "gap-3 px-2"}`}>
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-lg">trending_up</span>
            </div>
            {!isCollapsed && <span className="font-bold text-xl text-brand tracking-tight">TradeSage</span>}
          </div>

          <nav className="flex-1 space-y-2 w-full">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Dashboard" : ""}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink
              to="/explorer"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Market" : ""}
            >
              <TrendingUp className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Market</span>}
            </NavLink>
            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Portfolio" : ""}
            >
              <Briefcase className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Portfolio</span>}
            </NavLink>
            <div className="relative">
              <NavLink
                to="/ai-insights"
                className={({ isActive }) =>
                  `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                    isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                  }`
                }
                title={isCollapsed ? "AI Insights" : ""}
              >
                <BrainCircuit className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>AI Insights</span>}
              </NavLink>
              <span className={`absolute bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none ${
                isCollapsed ? "top-1 right-2" : "top-1/2 -translate-y-1/2 right-4"
              }`}>
                3
              </span>
            </div>
            <NavLink
              to="/scanner"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Scanner" : ""}
            >
              <Activity className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Scanner</span>}
            </NavLink>
            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Watchlist" : ""}
            >
              <Star className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Watchlist</span>}
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Orders" : ""}
            >
              <ClipboardList className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Orders</span>}
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Analytics" : ""}
            >
              <BarChart2 className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Analytics</span>}
            </NavLink>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Calendar" : ""}
            >
              <CalendarIcon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Calendar</span>}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center rounded-custom transition-all font-semibold ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"} ${
                  isActive ? "bg-surface-low text-brand" : "text-gray-400 hover:bg-gray-50 hover:text-brand"
                }`
              }
              title={isCollapsed ? "Settings" : ""}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </NavLink>
          </nav>

          {/* Sidebar Bottom: Live Balance Card & Theme */}
          <div className="mt-auto pt-6 border-t border-gray-100 w-full">
            
            {/* Live Balance Card */}
            {isCollapsed ? (
              <div className="flex justify-center mb-6" title={`Balance: ₹${totalBalance.toLocaleString()}`}>
                <div className="p-3 bg-surface rounded-xl border border-gray-100/50 relative text-brand">
                  <Wallet className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger border border-white animate-pulse"></span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-surface rounded-custom mb-6 border border-gray-100/50 shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-medium">Live balance</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-brand">₹{totalBalance.toLocaleString()}</span>
                  <button className="text-gray-400 hover:text-brand transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <div className="text-xs text-success font-bold mt-1">
                  ↑ 0.42% <span className="text-gray-400 font-medium">(+₹66.25)</span>
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <div className={`flex bg-surface-low rounded-full p-1 border border-gray-200/60 ${isCollapsed ? "flex-col gap-1" : "flex-row"}`}>
              <button
                onClick={() => setDarkMode(false)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                  !darkMode ? "bg-white shadow-sm text-brand" : "text-gray-400 hover:text-gray-600"
                } ${isCollapsed ? "p-2" : "py-1.5 text-xs"}`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && <span>Light</span>}
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full font-bold transition-all cursor-pointer ${
                  darkMode ? "bg-white shadow-sm text-brand" : "text-gray-400 hover:text-gray-600"
                } ${isCollapsed ? "p-2" : "py-1.5 text-xs"}`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 shrink-0" />
                {!isCollapsed && <span>Dark</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface">
          {/* Top Header */}
          <header className="h-20 flex items-center justify-between px-8 bg-surface shrink-0">
            {/* Search Bar */}
            <div className="relative w-full max-w-md hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search"
                onClick={() => setSearchModalOpen(true)}
                readOnly
                className="block w-full pl-10 pr-12 py-2.5 bg-white border border-gray-100 rounded-custom shadow-sm text-sm font-medium focus:ring-1 focus:ring-gray-200 cursor-pointer text-brand placeholder-gray-400 outline-none"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-[10px] font-mono font-bold bg-gray-50 border border-gray-200 text-gray-400 px-1.5 py-0.5 rounded leading-tight shadow-sm">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right Side Icons & Profile */}
            <div className="flex items-center gap-4 ml-auto">
              <button 
                onClick={() => setAiChatOpen(!aiChatOpen)}
                className="p-2 text-gray-400 hover:text-brand transition-colors cursor-pointer"
                title="AI Assistant"
              >
                <Bot className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-brand transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger border-2 border-surface rounded-full"></span>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="h-8 w-8 bg-brand rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-md border border-gray-100">
                  {user?.name ? user.name.slice(0, 2) : "AV"}
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </header>

          {/* Scrollable Content Outlet */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 scrollbar-hide relative">
            <Outlet />
          </div>
        </div>

        {/* Global Components */}
        <GlobalSearchModal 
          isOpen={searchModalOpen} 
          onClose={() => setSearchModalOpen(false)} 
        />
        
        {aiChatOpen && (
          <div className="absolute bottom-6 right-6 w-[400px] h-[600px] max-h-[80%] max-w-[90%] z-50 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-5 duration-200 bg-white">
            <AIChat onClose={() => setAiChatOpen(false)} />
          </div>
        )}

        <TradeModal />
      </main>
    </div>
  );
}

export default AppLayout;
