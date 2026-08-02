import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useStockSearch from "../../hooks/useStockSearch";
import useWatchlistStore from "../../store/watchlistStore";
import useTradingStore from "../../store/tradingStore";
import { Search, X, Star, TrendingUp, Sparkles } from "lucide-react";

const QUICK_CHIPS = [
  { symbol: "TCS", companyName: "Tata Consultancy Services", exchange: "NSE", token: "11536" },
  { symbol: "RELIANCE", companyName: "Reliance Industries", exchange: "NSE", token: "2885" },
  { symbol: "SBIN", companyName: "State Bank of India", exchange: "NSE", token: "3045" },
  { symbol: "TATAMOTORS", companyName: "Tata Motors", exchange: "NSE", token: "3456" },
  { symbol: "NVDA", companyName: "NVIDIA Corp", exchange: "NASDAQ", token: null },
  { symbol: "BTC", companyName: "Bitcoin / USD", exchange: "CRYPTO", token: null },
];

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // No debounce needed — useStockSearch handles instant local + debounced server
  const { data: stocks = [], isLoading } = useStockSearch(query);
  const { isStockInWatchlist, toggleStockInWatchlist } = useWatchlistStore();
  const { selectStock } = useTradingStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [stocks]);

  const handleSelect = useCallback((stock) => {
    // Pass token + exchange so StockDetailsPage resolves immediately without waiting for search API
    selectStock({
      symbol: stock.symbol,
      companyName: stock.companyName,
      exchange: stock.exchange || "NSE",
      token: stock.token || null,
    });
    navigate(`/stock/${stock.symbol}`);
    onClose();
  }, [selectStock, navigate, onClose]);

  const handleToggleWatchlist = (e, stock) => {
    e.stopPropagation();
    toggleStockInWatchlist(stock);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!stocks.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, stocks.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(stocks[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex];
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 shadow-none overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <Search className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search TCS, AAPL, NIFTY, SBIN, BTC... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none text-sm font-medium font-sans"
          />
          {/* Loading spinner — only shows when server is augmenting results */}
          {isLoading && (
            <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-400 mr-2 flex-shrink-0" />
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-0.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-mono font-bold rounded uppercase transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" /> POPULAR:
            </span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.symbol}
                onClick={() => handleSelect(chip)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono font-bold text-slate-800 dark:text-slate-200 text-xs transition cursor-pointer flex-shrink-0 flex items-center gap-1"
              >
                <span>{chip.symbol}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {stocks.length > 0 ? (
            stocks.map((stock, idx) => {
              const inWatchlist = isStockInWatchlist(stock.symbol);
              const isActive = idx === activeIndex;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded cursor-pointer transition group ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded font-mono font-bold flex items-center justify-center text-xs border flex-shrink-0 ${
                      isActive
                        ? "bg-white text-slate-900 border-slate-200"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700"
                    }`}>
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-sm ${isActive ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                          {stock.symbol}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                          {stock.exchange || "NSE"}
                        </span>
                        {/* Show a small ⚡ if we have a token (means real data) */}
                        {stock.token && (
                          <span className="text-[9px] text-emerald-600 font-bold">⚡ LIVE</span>
                        )}
                      </div>
                      <p className={`text-xs truncate max-w-xs sm:max-w-md font-sans ${isActive ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                        {stock.companyName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleWatchlist(e, stock)}
                      className={`px-3 py-1.5 rounded border transition cursor-pointer flex items-center gap-1.5 text-xs font-medium font-sans ${
                        inWatchlist
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                          : isActive
                          ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                      title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                      <Star className={`w-3.5 h-3.5 ${inWatchlist ? "fill-amber-500 text-amber-500" : ""}`} />
                      <span className="hidden sm:inline font-sans">
                        {inWatchlist ? "Saved" : "Watch"}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(stock);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition font-sans ${
                        isActive
                          ? "bg-white text-slate-900 hover:bg-slate-100"
                          : "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white"
                      }`}
                    >
                      Trade
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm font-medium font-sans">
              No matching assets found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center font-sans">
          <span>
            <strong className="font-mono text-slate-700 dark:text-slate-300">↑↓</strong> navigate •{" "}
            <strong className="font-mono text-slate-700 dark:text-slate-300">Enter</strong> select •{" "}
            <strong className="font-mono text-slate-700 dark:text-slate-300">Esc</strong> exit
          </span>
          <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
            {stocks.length} result{stocks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
