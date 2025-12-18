import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { FeedResponse } from "../types/types";

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],

    queryFn: ({ pageParam }) =>
      apiFetch<FeedResponse>(
        `/api/feed${pageParam ? `?cursor=${pageParam}` : ""}`
      ),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    staleTime: 30 * 1000, // feed doesn't need to refetch aggressively
  });
}
