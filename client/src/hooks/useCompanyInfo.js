import { useQuery } from "@tanstack/react-query";
import { getCompanyInfo } from "../services/marketApi";

export const useCompanyInfo = (stock) => {
    return useQuery({
        queryKey: ["company", stock?.symbol],
        queryFn: async () => {
            if (!stock || !stock.symbol) return null;
            return await getCompanyInfo(
                stock.symbol,
                stock.exchange,
                stock.token
            );
        },
        enabled: !!stock && !!stock.symbol,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours (company info is static)
    });
};
