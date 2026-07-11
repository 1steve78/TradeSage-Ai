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

export const getCompanyProfile = async () => {};

export const getMarketNews = async () => {};