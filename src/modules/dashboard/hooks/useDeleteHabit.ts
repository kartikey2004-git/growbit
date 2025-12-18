import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Habit } from "../types/habit";
import { apiFetch } from "@/lib/api/apiFetch";

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) =>
      apiFetch(`/api/habits/${habitId}`, {
        method: "DELETE",
      }),

    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: ["habits"] });

      const prevHabits = queryClient.getQueryData<Habit[]>(["habits"]);

      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old?.filter((h) => h.id !== habitId)
      );

      return { prevHabits };
    },

    onError: (_err, _habitId, ctx) => {
      if (ctx?.prevHabits) {
        queryClient.setQueryData(["habits"], ctx.prevHabits);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
