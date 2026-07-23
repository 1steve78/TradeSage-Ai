import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateMarketPulse, getInsightHistory } from "../api/aiApi";

export const useMarketPulse = () => {
  return useQuery({
    queryKey: ["marketPulse"],
    queryFn: generateMarketPulse,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
};

export const useRefreshMarketPulse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateMarketPulse,
    onSuccess: (data) => {
      queryClient.setQueryData(["marketPulse"], data);
      queryClient.invalidateQueries({ queryKey: ["insightHistory"] });
    },
  });
};

export const useInsightHistory = () => {
  return useQuery({
    queryKey: ["insightHistory"],
    queryFn: getInsightHistory,
    staleTime: 1000 * 60 * 2,
  });
};

export default {
  useMarketPulse,
  useRefreshMarketPulse,
  useInsightHistory,
};
