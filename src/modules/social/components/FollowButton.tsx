"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToggleFollow } from "../hooks/useToggleFollow";

type Props = {
  userId: string;
  isFollowing: boolean;
};

export function FollowButton({ userId, isFollowing }: Props) {
  const { mutate, isPending } = useToggleFollow();

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        size="sm"
        variant={isFollowing ? "secondary" : "default"}
        disabled={isPending}
        onClick={() => mutate({ targetUserId: userId })}
        className="rounded-full px-4"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </motion.div>
  );
}
