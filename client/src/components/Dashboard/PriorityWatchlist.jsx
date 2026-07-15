import { useState } from "react";
import useWatchlistStore from "../../store/watchlistStore";
import useMarketStore from "../../store/marketStore";
import SearchBar from "../SearchBar/SearchBar";

const PriorityWatchlist = () => {
  const {
    watchlists,
    selectedWatchlist,
    setSelectedWatchlist,
    removeStock,
  } = useWatchlistStore();

  const pricesMap = useMarketStore((state) => state.prices);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Priority Watchlist
          </h3>
          {/* Watchlist selector dropdown */}
          {watchlists.length > 0 && (
            <select
              value={selectedWatchlist?._id ?? ""}
              onChange={(e) => {
                const wl = watchlists.find((w) => w._id === e.target.value);
                if (wl) setSelectedWatchlist(wl);
              }}
              className="text-xs font-bold text-slate-700 outline-none bg-transparent border-none mt-1 cursor-pointer"
            >
              {watchlists.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <button className="text-slate-400 hover:text-slate-900 transition cursor-pointer">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      </div>

      {/* Inline search bar toggled by "+ Add New Symbol" */}
      {showSearch && (
        <div className="border-t border-[#f2f4f6] pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-[#0f172a] uppercase">Add Ticker</span>
            <button
              onClick={() => setShowSearch(false)}
              className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              Close
            </button>
          </div>
          <SearchBar />
        </div>
      )}

      {/* List of Watchlist Stocks */}
      <div className="space-y-3">
        {selectedWatchlist && selectedWatchlist.stocks.length > 0 ? (
          selectedWatchlist.stocks.map((stock) => {
            const livePrice = pricesMap[stock.symbol];
            const current = livePrice?.price ?? null;
            const previous = livePrice?.previousPrice ?? null;
            const change = current && previous ? current - previous : 0;
            const pct = previous ? (change / previous) * 100 : 0;

            return (
              <div
                key={stock.symbol}
                className="group flex justify-between items-center py-2.5 border-b border-[#f2f4f6] last:border-0 hover:bg-slate-50 px-1 rounded-[2px] transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">
                    {stock.symbol}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                    {stock.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#0f172a]">
                      {current ? `$${current.toFixed(2)}` : "--"}
                    </p>
                    {current && (
                      <p className={`font-mono text-[9px] font-bold flex items-center justify-end gap-0.5 ${
                        change >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {change >= 0 ? "▲" : "▼"} {Math.abs(pct).toFixed(2)}%
                      </p>
                    )}
                  </div>

                  {/* Tiny hover remove option */}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await removeStock(selectedWatchlist._id, stock.symbol);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center font-medium">
            No symbols in watchlist.
          </p>
        )}
      </div>

      {/* "+ Add New Symbol" Action button */}
      {!showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          className="w-full border border-dashed border-[#c6c6cd] hover:border-slate-400 text-[10px] font-bold text-slate-500 hover:text-slate-900 py-2.5 rounded-[2px] transition uppercase tracking-wider cursor-pointer"
        >
          + Add New Symbol
        </button>
      )}
    </div>
  );
};

export default PriorityWatchlist;
