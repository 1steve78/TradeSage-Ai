import api from "../api/axios";

export const searchStocks = async (query) => {
    try {
        const response = await api.get("/stocks/search", {
            params: {
                q: query,
            },
        });

        return response.data.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to search stocks"
        );
    }
};

export const getQuote = async () => {};

export const getCompanyInfo = async (symbol, exchange, token) => {
    try {
        const params = {};
        if (exchange) params.exchange = exchange;
        if (token) params.token = token;

        const response = await api.get(`/stocks/${symbol}/company`, { params });
        return response.data.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to fetch company info"
        );
    }
};

export const getCompanyProfile = async () => {};

export const getMarketNews = async () => {};

export const getStockHistory = async (symbol, interval = "1M", exchange = null, token = null, indicators = null) => {
    try {
        const params = { interval };
        if (exchange) params.exchange = exchange;
        if (token) params.token = token;
        if (indicators && indicators.length > 0) {
            params.indicators = indicators.join(",");
        }

        const response = await api.get(`/stocks/${symbol}/history`, { params });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to fetch stock history"
        );
    }
};