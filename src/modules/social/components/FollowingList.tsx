"use client";

import { motion } from "framer-motion";
import { useFollowing } from "../hooks/useFollowing";
import { UserRow } from "./UserRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FollowingList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowing();

  const users = data?.pages.flatMap((p) => p.data) ?? [];

  if (!users.length) {
    return (
      <p className="text-sm text-muted-foreground">
        You are not following anyone yet.
      </p>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      {users.map((u, i) => (
        <motion.div
          key={u.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <UserRow user={u} />
        </motion.div>
      ))}

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
    </Card>
  );
}
