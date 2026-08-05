import { useQuery } from "@tanstack/react-query";
import { getStockHistory } from "../services/marketApi";

export const useHistoricalData = (stock, interval, indicators = []) => {
    // For NSE/BSE stocks, wait until we have a valid token before fetching.
    // Without a token, the backend falls back to mock data at ₹150.
    const isIndianExchange = stock?.exchange === "NSE" || stock?.exchange === "BSE";
    const hasToken = !!stock?.token;
    const isEnabled = !!stock && !!stock.symbol && (!isIndianExchange || hasToken);

    return useQuery({
        queryKey: ["history", stock?.symbol, stock?.token, interval, indicators.join(",")],
        queryFn: async () => {
            const res = await getStockHistory(
                stock.symbol,
                interval,
                stock.exchange,
                stock.token,
                indicators
            );
            if (res.success && res.data) {
                // Return both candles data and indicators
                return {
                    data: res.data,
                    indicators: res.indicators
                };
            }
            throw new Error("Failed to fetch historical data");
        },
        enabled: isEnabled,
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
