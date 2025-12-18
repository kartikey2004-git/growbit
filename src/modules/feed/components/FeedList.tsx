"use client";

import { motion } from "framer-motion";
import { useFeed } from "../hooks/useFeed";
import { FeedItemCard } from "./FeedItemCard";
import { FeedSkeleton } from "./FeedSkeleton";
import { Button } from "@/components/ui/button";

export function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeed();

  if (isLoading) {
    return <FeedSkeleton />;
  }

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Follow people to see their activity.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
        >
          <FeedItemCard item={item} />
        </motion.div>
      ))}

      {hasNextPage && (
        <Button
          variant="ghost"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto"
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
