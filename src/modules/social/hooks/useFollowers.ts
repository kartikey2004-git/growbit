import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { PaginatedResponse, User } from "../types/types";

export function useFollowers() {
  return useInfiniteQuery({
    queryKey: ["followers"],

    queryFn: ({ pageParam }) =>
      apiFetch<PaginatedResponse<User>>(
        `/api/followers${pageParam ? `?cursor=${pageParam}` : ""}`
      ),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
