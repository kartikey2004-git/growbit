"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchUsers } from "@/modules/social/hooks/useSearchUsers";
import { UserRow } from "@/modules/social/components/UserRow";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function SearchUsersPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchUsers(debouncedQuery);

  const users = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        w-full
        px-4 sm:px-6 lg:px-8
        py-6
        space-y-4
      "
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Search Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Search users to make new connections/friends
        </p>
      </div>

      <Input
        placeholder="Search by name or username…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10"
      />

      {users.length === 0 && debouncedQuery.length >= 2 && (
        <p className="text-sm text-muted-foreground">No users found</p>
      )}

      <div className="space-y-3">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <UserRow user={user} />
          </motion.div>
        ))}
      </div>

      {hasNextPage && (
        <Button
          variant="ghost"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto"
        >
          Load more
        </Button>
      )}
    </motion.div>
  );
}
