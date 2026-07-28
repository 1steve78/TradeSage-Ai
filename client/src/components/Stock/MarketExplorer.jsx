import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMarketStore from "../../store/marketStore";
import useWatchlistStore from "../../store/watchlistStore";
import useTradingStore from "../../store/tradingStore";
import { Search, Star, TrendingUp, ArrowUpRight, ArrowDownRight, SlidersHorizontal, Globe } from "lucide-react";

const EXPLORER_MARKETS = [
  { symbol: "TCS", companyName: "Tata Consultancy Services Ltd.", category: "NSE", price: 3856.0, changePct: 1.23, sector: "Technology" },
  { symbol: "SBIN", companyName: "State Bank of India", category: "NSE", price: 842.6, changePct: 1.48, sector: "Banking" },
  { symbol: "RELIANCE", companyName: "Reliance Industries Ltd.", category: "NSE", price: 1297.8, changePct: -0.47, sector: "Energy / Telecom" },
  { symbol: "INFY", companyName: "Infosys Limited", category: "NSE", price: 1820.5, changePct: 0.85, sector: "Technology" },
  { symbol: "HDFCBANK", companyName: "HDFC Bank Ltd.", category: "NSE", price: 1640.0, changePct: 0.32, sector: "Banking" },
  { symbol: "TATAMOTORS", companyName: "Tata Motors Ltd.", category: "NSE", price: 995.0, changePct: 2.10, sector: "Automotive" },
  { symbol: "ICICIBANK", companyName: "ICICI Bank Ltd.", category: "NSE", price: 1210.0, changePct: 0.92, sector: "Banking" },
  
  { symbol: "AAPL", companyName: "Apple Inc.", category: "US", price: 212.5, changePct: 1.65, sector: "Technology" },
  { symbol: "TSLA", companyName: "Tesla, Inc.", category: "US", price: 301.2, changePct: -1.82, sector: "Automotive / EV" },
  { symbol: "NVDA", companyName: "NVIDIA Corporation", category: "US", price: 182.6, changePct: 3.40, sector: "Semiconductors" },
  { symbol: "MSFT", companyName: "Microsoft Corporation", category: "US", price: 518.3, changePct: 0.95, sector: "Cloud / Software" },
  { symbol: "AMZN", companyName: "Amazon.com, Inc.", category: "US", price: 226.9, changePct: 1.12, sector: "E-Commerce" },
  { symbol: "GOOGL", companyName: "Alphabet Inc.", category: "US", price: 178.45, changePct: -0.35, sector: "Internet / AI" },

  { symbol: "BTC", companyName: "Bitcoin / USD", category: "Crypto", price: 67284.1, changePct: 2.45, sector: "Crypto Currency" },
  { symbol: "ETH", companyName: "Ethereum / USD", category: "Crypto", price: 3492.1, changePct: 1.15, sector: "Smart Contracts" },
];

const MarketExplorer = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchFilter, setSearchFilter] = useState("");
  const navigate = useNavigate();

  const pricesMap = useMarketStore((state) => state.prices);
  const { isStockInWatchlist, toggleStockInWatchlist } = useWatchlistStore();
  const { selectStock } = useTradingStore();

  const filteredStocks = EXPLORER_MARKETS.filter((s) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "NSE" && s.category === "NSE") ||
      (activeTab === "US" && s.category === "US") ||
      (activeTab === "CRYPTO" && s.category === "Crypto");

    const matchesSearch =
      s.symbol.toUpperCase().includes(searchFilter.trim().toUpperCase()) ||
      s.companyName.toUpperCase().includes(searchFilter.trim().toUpperCase());

    return matchesTab && matchesSearch;
  });

  const handleStockClick = (stock) => {
    selectStock({ symbol: stock.symbol, companyName: stock.companyName });
    navigate(`/stock/${stock.symbol}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md bg-white p-lg rounded-xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            <h1 className="font-display-lg text-xl sm:text-2xl font-bold text-[#0f172a]">
              Market Stock Directory & Explorer
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Explore live quotes across Indian Equities (NSE), US Stocks, and Crypto assets.
          </p>
        </div>

        {/* Search input in explorer */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter stocks, symbols..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-9 pr-4 text-xs font-semibold text-[#0f172a] outline-none focus:border-primary focus:bg-white transition"
          />
        </div>
      </div>

      {/* Directory Tabs */}
      <div className="flex items-center justify-between border-b border-outline-variant pb-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "All Markets" },
            { id: "NSE", label: "Indian Equities (NSE)" },
            { id: "US", label: "US Stocks (NASDAQ/NYSE)" },
            { id: "CRYPTO", label: "Crypto Assets" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-outline-variant"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-400 font-mono hidden sm:inline">
          Showing {filteredStocks.length} Assets
        </span>
      </div>

      {/* Stocks Table */}
      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset / Symbol</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exchange</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Live Price</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">24h Change</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => {
                  const live = pricesMap[stock.symbol]?.price;
                  const price = live ?? stock.price;
                  const isUp = stock.changePct >= 0;
                  const inWatchlist = isStockInWatchlist(stock.symbol);

                  return (
                    <tr
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Symbol & Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                            {stock.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-[#0f172a] text-sm group-hover:text-primary transition block">
                              {stock.symbol}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                              {stock.companyName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Exchange */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase border border-slate-200">
                          {stock.category}
                        </span>
                      </td>

                      {/* Sector */}
                      <td className="p-4 text-slate-500 font-semibold">{stock.sector}</td>

                      {/* Live Price */}
                      <td className="p-4 text-right font-data-mono font-bold text-[#0f172a]">
                        ₹{price.toFixed(2)}
                      </td>

                      {/* Change */}
                      <td className="p-4 text-right font-data-mono font-bold">
                        <span
                          className={`inline-flex items-center gap-0.5 ${
                            isUp ? "text-green-600" : "text-rose-600"
                          }`}
                        >
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {isUp ? "+" : ""}
                          {stock.changePct.toFixed(2)}%
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleStockInWatchlist(stock)}
                            className={`p-2 rounded-lg border transition cursor-pointer ${
                              inWatchlist
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500"
                            }`}
                            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                          >
                            <Star className={`w-4 h-4 ${inWatchlist ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>

                          <button
                            onClick={() => handleStockClick(stock)}
                            className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            View & Trade
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 text-xs font-medium">
                    No assets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketExplorer;
