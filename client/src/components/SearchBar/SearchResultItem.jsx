const SearchResultItem = ({ stock, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(stock)} // Execute the function passed from the top
      className="cursor-pointer border-b p-3 hover:bg-gray-100 transition last:border-b-0"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">
            {stock.symbol}
          </h3>
          <p className="text-sm text-gray-500">
            {stock.companyName}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            {stock.exchange}
          </p>
          <p className="text-xs text-gray-500">
            {stock.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;