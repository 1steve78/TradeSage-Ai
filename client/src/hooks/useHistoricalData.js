import { useQuery } from "@tanstack/react-query";
import { getStockHistory } from "../services/marketApi";

export const useHistoricalData = (stock, interval, indicators = []) => {
    return useQuery({
        queryKey: ["history", stock?.symbol, interval, indicators.join(",")],
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
        enabled: !!stock && !!stock.symbol,
        staleTime: 1000 * 60,
    });
};
