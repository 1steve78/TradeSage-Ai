import React from "react";

const FilterPanel = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg mb-lg flex flex-wrap gap-lg items-end">
            <div className="flex-1 min-w-[200px]">
                <label className="font-label-caps text-[10px] text-secondary mb-2 block">PRICE RANGE (₹)</label>
                <div className="flex gap-2 items-center">
                    <input 
                        type="number" 
                        name="priceMin"
                        value={filters.priceMin || ""}
                        onChange={handleChange}
                        placeholder="Min" 
                        className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded focus:border-primary outline-none"
                    />
                    <span className="text-outline-variant">-</span>
                    <input 
                        type="number" 
                        name="priceMax"
                        value={filters.priceMax || ""}
                        onChange={handleChange}
                        placeholder="Max" 
                        className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded focus:border-primary outline-none"
                    />
                </div>
            </div>

            <div className="w-[150px]">
                <label className="font-label-caps text-[10px] text-secondary mb-2 block">MIN VOLUME</label>
                <select 
                    name="minVolume"
                    value={filters.minVolume || ""}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded focus:border-primary outline-none">
                    <option value="">Any Volume</option>
                    <option value="100000">1 Lakh</option>
                    <option value="500000">5 Lakh</option>
                    <option value="1000000">10 Lakh</option>
                    <option value="5000000">50 Lakh</option>
                </select>
            </div>

            <div className="w-[150px]">
                <label className="font-label-caps text-[10px] text-secondary mb-2 block">SECTOR</label>
                <select 
                    name="sector"
                    value={filters.sector || "All"}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded focus:border-primary outline-none">
                    <option value="All">All Sectors</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Energy">Energy</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Utilities">Utilities</option>
                </select>
            </div>

            <div className="w-[150px]">
                <label className="font-label-caps text-[10px] text-secondary mb-2 block">SENTIMENT</label>
                <select 
                    name="sentiment"
                    value={filters.sentiment || "All"}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded focus:border-primary outline-none">
                    <option value="All">Any Sentiment</option>
                    <option value="Bullish">Bullish</option>
                    <option value="Slightly Bullish">Slightly Bullish</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Bearish">Bearish</option>
                </select>
            </div>

            <div className="w-[150px]">
                <label className="font-label-caps text-[10px] text-secondary mb-2 block">SORT BY</label>
                <select 
                    name="sortBy"
                    value={filters.sortBy || "Highest Score"}
                    onChange={handleChange}
                    className="w-full bg-surface-container border border-outline-variant px-sm py-xs text-body-sm rounded font-bold focus:border-primary outline-none">
                    <option value="Highest Score">Highest Score</option>
                    <option value="Highest Gain">Highest Gain</option>
                    <option value="Highest Volume">Highest Volume</option>
                    <option value="Lowest Price">Lowest Price</option>
                </select>
            </div>
            
            <div>
                <button 
                    onClick={() => onFilterChange("reset", true)}
                    className="px-md py-xs text-xs font-label-caps text-secondary hover:text-primary transition-colors border border-outline-variant rounded bg-surface-container hover:bg-surface-container-high h-[34px]">
                    RESET
                </button>
            </div>
        </div>
    );
};

export default FilterPanel;
