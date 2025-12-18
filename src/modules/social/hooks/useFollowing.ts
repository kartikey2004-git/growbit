import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { PaginatedResponse, User } from "../types/types";

export function useFollowing() {
  return useInfiniteQuery({
    queryKey: ["following"],

    queryFn: ({ pageParam }) =>
      apiFetch<PaginatedResponse<User>>(
        `/api/following${pageParam ? `?cursor=${pageParam}` : ""}`
      ),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
