import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { HabitStatsResponse } from "../types/types";

export function useHabitStats() {
  return useQuery({
    queryKey: ["habit-stats"],
    queryFn: () => apiFetch<HabitStatsResponse>("/api/stats/streaks"),
    staleTime: 60 * 1000,
  });
}
