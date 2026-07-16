import { useState, useEffect } from "react";
import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";
import useTradingStore from "../../store/tradingStore";
import useSocket from "../../hooks/useSocket";
import SearchBar from "../SearchBar/SearchBar";

const PriorityWatchlist = () => {
  const {
    watchlists,
    selectedWatchlist,
    setSelectedWatchlist,
    removeStock,
    createWatchlist,
  } = useWatchlistStore();

  const pricesMap = useMarketStore((state) => state.prices);
  const { selectStock } = useTradingStore();
  const setSubscribedWatchlist = useMarketStore((state) => state.setSubscribedWatchlist);
  const { joinWatchlist, leaveWatchlist } = useSocket();
  const [showSearch, setShowSearch] = useState(false);

  // Handle Socket.io watchlist room subscription lifecycle
  useEffect(() => {
    if (!selectedWatchlist?._id) return;
    const currentId = selectedWatchlist._id;

    joinWatchlist(currentId);
    setSubscribedWatchlist(currentId);

    return () => {
      leaveWatchlist(currentId);
      setSubscribedWatchlist(null);
    };
  }, [selectedWatchlist?._id, joinWatchlist, leaveWatchlist, setSubscribedWatchlist]);

  const handleCreateWatchlist = async () => {
    const name = prompt("Enter new watchlist name:");
    if (name && name.trim()) {
      await createWatchlist(name.trim());
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low">
      {/* Watchlist Header */}
      <div className="p-md flex items-center justify-between border-b border-outline-variant bg-white">
        <span className="font-title-sm text-title-sm text-[#0f172a] font-bold">Watchlist</span>
        <button 
          onClick={handleCreateWatchlist}
          className="p-1 hover:bg-surface-container-high rounded cursor-pointer"
          title="New Watchlist"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-base">add_box</span>
        </button>
      </div>

      {/* Inline Search for Tickers */}
      <div className="p-sm bg-white border-b border-outline-variant">
        {showSearch ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#0f172a] uppercase">Add Ticker</span>
              <button
                onClick={() => setShowSearch(false)}
                className="text-[10px] text-slate-400 hover:text-slate-900 cursor-pointer font-bold uppercase"
              >
                Close
              </button>
            </div>
            <SearchBar />
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full border border-dashed border-[#c6c6cd] hover:border-slate-400 text-[10px] font-bold text-slate-500 hover:text-slate-900 py-1.5 rounded-[2px] transition uppercase tracking-wider cursor-pointer"
          >
            + Add New Symbol
          </button>
        )}
      </div>

      {/* Folders and Stocks Tree */}
      <nav className="p-sm flex-1 overflow-y-auto space-y-1">
        {watchlists.length > 0 ? (
          watchlists.map((w) => {
            const isActive = selectedWatchlist?._id === w._id;
            return (
              <div key={w._id} className="space-y-0.5">
                <button
                  onClick={() => setSelectedWatchlist(w)}
                  className={`w-full flex items-center justify-between px-md py-2.5 text-xs rounded transition-colors text-left cursor-pointer ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container font-bold border-r-4 border-primary"
                      : "hover:bg-surface-dim text-on-surface-variant font-medium"
                  }`}
                >
                  <span className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-base">
                      {isActive ? "star" : "folder"}
                    </span>
                    {w.name}
                  </span>
                  <span className="font-data-mono text-[10px] opacity-60">{w.stocks.length}</span>
                </button>

                {/* If active, expand list of stocks */}
                {isActive && (
                  <div className="pl-md mt-1 space-y-0.5 border-l border-outline-variant/30 ml-4">
                    {w.stocks.map((stock) => {
                      const live = pricesMap[stock.symbol];
                      const price = live?.price ?? 212.5;
                      const prevPrice = live?.previousPrice ?? price;
                      const isUp = price >= prevPrice;

                      return (
                        <div
                          key={stock.symbol}
                          onClick={() => selectStock({ symbol: stock.symbol, companyName: stock.companyName })}
                          className="flex items-center justify-between px-md py-1.5 hover:bg-surface-dim rounded cursor-pointer text-xs group/row"
                        >
                          <span className="font-semibold text-slate-700">{stock.symbol}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-data-mono font-bold ${isUp ? "text-green-600" : "text-rose-600"}`}>
                              ₹{price.toFixed(2)}
                            </span>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await removeStock(w._id, stock.symbol);
                              }}
                              className="opacity-0 group-hover/row:opacity-100 transition text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {w.stocks.length === 0 && (
                      <p className="text-[10px] text-slate-400 py-2 pl-4">No symbols in watchlist.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 p-md text-center">No watchlists found.</p>
        )}
      </nav>

      {/* AI Recommendation Alert card in Sidebar */}
      <div className="p-md space-y-md border-t border-outline-variant bg-white">
        <div className="bg-[#131b2e] p-md rounded border border-black text-white relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-5">
            <span className="material-symbols-outlined text-[64px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <p className="font-label-caps text-[9px] text-slate-400 uppercase tracking-widest mb-1">AI Recommendation</p>
          <p className="text-xs font-bold mb-3">Portfolio rebalance needed.</p>
          <button className="text-[10px] bg-white text-primary px-3 py-1 rounded font-bold hover:bg-opacity-90 cursor-pointer transition active:scale-95">
            View Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriorityWatchlist;
