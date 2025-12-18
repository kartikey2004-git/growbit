import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/apiFetch";
import { PaginatedResponse, User } from "../types/types";

export function useSearchUsers(query: string) {
  return useInfiniteQuery({
    queryKey: ["user-search", query],

    enabled: query.trim().length >= 2,

    queryFn: ({ pageParam }) =>
      apiFetch<PaginatedResponse<User>>(
        `/api/users/search?q=${encodeURIComponent(query)}${
          pageParam ? `&cursor=${pageParam}` : ""
        }`
      ),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
