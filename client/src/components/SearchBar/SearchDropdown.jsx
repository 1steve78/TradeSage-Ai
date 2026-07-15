import SearchResultItem from "./SearchResultItem";

const SearchDropdown = ({ stocks, loading, error, onSelect }) => {
  if (loading) {
    return (
      <div className="absolute z-50 mt-2 w-full rounded-[4px] border border-[#cbd5e1] bg-white p-4 text-slate-500 text-xs font-semibold">
        Searching...
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute z-50 mt-2 w-full rounded-[4px] border border-red-200 bg-red-50 p-4 text-red-700 text-xs font-semibold">
        {error.message}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="absolute z-50 mt-2 w-full rounded-[4px] border border-[#cbd5e1] bg-white p-4 text-slate-500 text-xs font-semibold">
        No stocks found
      </div>
    );
  }

  return (
    <div className="absolute z-50 mt-2 w-full rounded-[4px] border border-[#cbd5e1] bg-white overflow-hidden max-h-64 overflow-y-auto shadow-sm">
      {stocks.map((stock) => (
        <SearchResultItem
          key={stock.symbol}
          stock={stock}
          onSelect={onSelect} // Pass it down to the child
        />
      ))}
    </div>
  );
};

export default SearchDropdown;