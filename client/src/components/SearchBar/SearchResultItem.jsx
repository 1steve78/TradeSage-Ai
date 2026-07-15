const SearchResultItem = ({ stock, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(stock)} // Execute the function passed from the top
      className="cursor-pointer border-b border-[#f2f4f6] p-3 hover:bg-slate-50 transition last:border-b-0"
    >
      <div className="flex justify-between items-center text-xs">
        <div>
          <h3 className="font-bold text-[#0f172a]">
            {stock.symbol}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            {stock.companyName}
          </p>
        </div>

        <div className="text-right">
          <p className="font-bold text-slate-700">
            {stock.exchange}
          </p>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            {stock.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;