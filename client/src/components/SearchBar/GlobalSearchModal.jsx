import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import useStockSearch from "../../hooks/useStockSearch";
import useWatchlistStore from "../../store/watchlistStore";
import useTradingStore from "../../store/tradingStore";
import { Search, X, Star, TrendingUp, Sparkles } from "lucide-react";

const QUICK_CHIPS = [
  { symbol: "TCS", companyName: "Tata Consultancy Services" },
  { symbol: "AAPL", companyName: "Apple Inc." },
  { symbol: "SBIN", companyName: "State Bank of India" },
  { symbol: "RELIANCE", companyName: "Reliance Industries" },
  { symbol: "NVDA", companyName: "NVIDIA Corp" },
  { symbol: "BTC", companyName: "Bitcoin / USD" },
];

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: stocks = [], isLoading } = useStockSearch(debouncedQuery);
  const { isStockInWatchlist, toggleStockInWatchlist } = useWatchlistStore();
  const { selectStock } = useTradingStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (stock) => {
    selectStock({ symbol: stock.symbol, companyName: stock.companyName });
    navigate(`/stock/${stock.symbol}`);
    onClose();
  };

  const handleToggleWatchlist = (e, stock) => {
    e.stopPropagation();
    toggleStockInWatchlist(stock);
  };

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
            placeholder="Search TCS, AAPL, NIFTY, SBIN, BTC or markets... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none text-sm font-medium font-sans"
          />
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

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium flex items-center justify-center gap-2 font-sans">
              <Sparkles className="w-4 h-4 animate-spin text-slate-600 dark:text-slate-400" /> Querying instrument database...
            </div>
          ) : stocks.length > 0 ? (
            stocks.map((stock) => {
              const inWatchlist = isStockInWatchlist(stock.symbol);
              return (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelect(stock)}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold flex items-center justify-center text-xs border border-slate-200 dark:border-slate-700 flex-shrink-0">
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-slate-600 dark:group-hover:text-slate-300 transition">
                          {stock.symbol}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {stock.exchange || "NSE"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md font-sans">
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
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                      title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${inWatchlist ? "fill-amber-500 text-amber-500" : ""}`}
                      />
                      <span className="hidden sm:inline font-sans">
                        {inWatchlist ? "Saved" : "Watch"}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(stock);
                      }}
                      className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded text-xs font-bold transition font-sans"
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
          <span>Press <strong className="font-mono text-slate-700 dark:text-slate-300">Enter</strong> to select • <strong className="font-mono text-slate-700 dark:text-slate-300">Esc</strong> to exit</span>
          <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">TradeSage Search v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
