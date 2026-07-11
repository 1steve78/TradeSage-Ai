import { useQuery } from "@tanstack/react-query";

import { searchStocks } from "../services/marketApi";

export default function useStockSearch(query) {
    return useQuery({
        queryKey: ["stock-search", query],

        queryFn: () => searchStocks(query),

        enabled: query.trim().length > 0,
    });
}