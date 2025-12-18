import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";

type ToggleFollowInput = {
  targetUserId: string;
};

type ToggleFollowResponse = {
  data: {
    followed: boolean;
  };
};

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ targetUserId }: ToggleFollowInput) =>
      apiFetch<ToggleFollowResponse>("/api/follow", {
        method: "POST",
        body: JSON.stringify({ targetUserId }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["user-search"] });
    },
  });
}
