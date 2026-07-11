const WatchlistItem = ({
  watchlist,
  selected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(watchlist)}
      className={`
        w-full
        rounded-lg
        px-4
        py-3
        text-left
        transition

        ${
          selected
            ? "bg-blue-600 text-white"
            : "hover:bg-gray-100"
        }
      `}
    >
      <div className="font-medium">
        {watchlist.name}
      </div>

      <div className="text-sm opacity-70">
        {watchlist.stocks.length} stocks
      </div>
    </button>
  );
};

export default WatchlistItem;