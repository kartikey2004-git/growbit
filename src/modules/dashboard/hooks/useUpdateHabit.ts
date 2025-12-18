import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";

type UpdateHabitInput = {
  habitId: string;
  data: {
    name: string;
    frequency: "DAILY" | "WEEKLY";
    categoryId?: string;
  };
};

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, data }: UpdateHabitInput) =>
      apiFetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
