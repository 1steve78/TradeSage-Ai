/**
 * Applies a robust set of rule-based filters to a dataset of stocks.
 */
export const applyFilters = (stocks, filters) => {
    let results = [...stocks];

    if (filters.priceMin !== undefined && filters.priceMin !== "") {
        results = results.filter(s => s.price >= Number(filters.priceMin));
    }

    if (filters.priceMax !== undefined && filters.priceMax !== "") {
        results = results.filter(s => s.price <= Number(filters.priceMax));
    }

    if (filters.minVolume !== undefined && filters.minVolume !== "") {
        results = results.filter(s => s.volume >= Number(filters.minVolume));
    }

    if (filters.sector && filters.sector !== "All") {
        results = results.filter(s => s.sector?.toLowerCase() === filters.sector.toLowerCase());
    }

    if (filters.sentiment && filters.sentiment !== "All") {
        results = results.filter(s => s.sentiment?.toLowerCase() === filters.sentiment.toLowerCase());
    }
    
    if (filters.minChange !== undefined && filters.minChange !== "") {
        results = results.filter(s => s.change >= Number(filters.minChange));
    }

    if (filters.maxChange !== undefined && filters.maxChange !== "") {
        results = results.filter(s => s.change <= Number(filters.maxChange));
    }

    return results;
};
