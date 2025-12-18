import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { CompletionStatsResponse } from "../types/types";

export function useCompletionStats(range: "7d" | "30d" | "90d") {
  return useQuery({
    queryKey: ["completion-stats", range],
    queryFn: () =>
      apiFetch<CompletionStatsResponse>(
        `/api/stats/completions?range=${range}`
      ),
    staleTime: 60 * 1000,
  });
}
