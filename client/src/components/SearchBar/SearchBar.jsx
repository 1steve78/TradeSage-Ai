import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import useStockSearch from "../../hooks/useStockSearch";
import useWatchlistStore from "../../store/watchlistStore";
import SearchDropdown from "./SearchDropdown";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: stocks = [],
    isLoading,
    error,
  } = useStockSearch(debouncedSearch);

  const { selectedWatchlist, addStock } = useWatchlistStore();

  // Keep only the async version of handleStockSelect
  const handleStockSelect = async (stock) => {
    if (!selectedWatchlist) {
      alert("Please select a watchlist first.");
      return;
    }

    await addStock(selectedWatchlist._id, {
      symbol: stock.symbol,
      companyName: stock.companyName,
    });

    setSearch("");
  };

  return (
    <div className="relative w-full">
      <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-base font-semibold pointer-events-none">
        search
      </span>
      <input
        type="text"
        placeholder="Search markets, assets, or symbols..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-[4px] bg-[#f2f4f6] border border-transparent py-2 pl-9 pr-4 text-xs outline-none text-[#0f172a] placeholder-slate-400 font-semibold focus:border-[#0f172a] focus:bg-white transition-all duration-150"
      />

      {search.trim() !== "" && (
        <SearchDropdown
          stocks={stocks}
          loading={isLoading}
          error={error}
          onSelect={handleStockSelect}
        />
      )}
    </div>
  );
};

export default SearchBar;