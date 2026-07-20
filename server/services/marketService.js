import axios from "axios";

const finnhub = axios.create({
    baseURL: "https://finnhub.io/api/v1",
  
});

finnhub.interceptors.request.use((config) => {
    config.headers['X-Finnhub-Token'] = process.env.FINNHUB_API_KEY;
    return config;
});

export const searchStocks = async (query) => {
    // Let's add a sanity check right here to prove the key exists at execution time
    if (!process.env.FINNHUB_API_KEY) {
        throw new Error("CRITICAL: API Key is missing inside the service file!");
    }

    if (!query || !query.trim()) {
        throw new Error("Search query is required");
    }
    
    const response = await finnhub.get('/search', {
        params: {
            q: query,
        },
    });

    const stocks = response.data.result.map((stock) => ({
        symbol: stock.symbol,
        companyName: stock.description,
        exchange: stock.displaySymbol,
        type: stock.type,
    }));

    return stocks;
}

export const getCompanyProfile = async (symbol) => {
    if (!process.env.FINNHUB_API_KEY) {
        throw new Error("CRITICAL: API Key is missing inside the service file!");
    }

    if (!symbol || !symbol.trim()) {
        throw new Error("Symbol is required");
    }

    const response = await finnhub.get('/stock/profile2', {
        params: {
            symbol: symbol,
        },
    });

    return response.data;
};