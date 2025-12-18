"use client";

import { motion } from "framer-motion";
import { useFollowers } from "../hooks/useFollowers";
import { UserRow } from "./UserRow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FollowersList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowers();

  const users = data?.pages.flatMap((p) => p.data) ?? [];

  if (!users.length) {
    return <p className="text-sm text-muted-foreground">No followers yet.</p>;
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

