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
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search stocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border p-3 outline-none"
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