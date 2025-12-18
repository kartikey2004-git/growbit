import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { LeaderboardResponse } from "../types/types";

export function useLeaderboard(range: "all" | "weekly") {
  return useQuery({
    queryKey: ["leaderboard", range],
    queryFn: () =>
      apiFetch<LeaderboardResponse>(`/api/leaderboard?range=${range}`),
    staleTime: 60 * 1000,
  });
}
