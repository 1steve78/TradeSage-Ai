import SearchResultItem from "./SearchResultItem";

const SearchDropdown = ({ stocks, loading, error, onSelect }) => {
  if (loading) {
    return (
      <div className="absolute mt-2 w-full rounded-lg border bg-white shadow-lg p-4 text-gray-500">
        Searching...
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute mt-2 w-full rounded-lg border bg-white shadow-lg p-4 text-red-500">
        {error.message}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="absolute mt-2 w-full rounded-lg border bg-white shadow-lg p-4 text-gray-500">
        No stocks found
      </div>
    );
  }

  return (
    <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg overflow-hidden max-h-96 overflow-y-auto">
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