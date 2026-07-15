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
        rounded-xl
        px-4
        py-3
        text-left
        transition-all
        duration-200
        border
        cursor-pointer

        ${
          selected
            ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-200 shadow-sm"
            : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <div className="font-semibold text-sm tracking-wide">
        {watchlist.name}
      </div>

      <div className="text-xs opacity-60 mt-1">
        {watchlist.stocks.length} stocks
      </div>
    </button>
  );
};

export default WatchlistItem;