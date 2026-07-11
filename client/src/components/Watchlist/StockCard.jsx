import useWatchlistStore from "../../store/watchlistStore";

const StockCard = ({ stock }) => {
  const {
    selectedWatchlist,
    removeStock,
  } = useWatchlistStore();

  const handleRemove = async () => {
    if (!selectedWatchlist) return;

    await removeStock(
      selectedWatchlist._id,
      stock.symbol
    );
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">

      <div>
        <h3 className="font-semibold">
          {stock.symbol}
        </h3>

        <p className="text-sm text-gray-500">
          {stock.companyName}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      >
        Remove
      </button>

    </div>
  );
};

export default StockCard;