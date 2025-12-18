import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { Habit } from "../types/habit";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const res = await apiFetch<{ formattedHabits: Habit[] }>("/api/habits");
      return res.formattedHabits;
    },
  });
}
