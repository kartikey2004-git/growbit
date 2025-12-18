"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./FollowButton";
import { User } from "../types/types";

type Props = {
  user: User;
};

export function UserRow({ user }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="
        flex items-center justify-between
        rounded-xl 
        p-3"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <p className="text-sm font-medium">{user.name ?? "Unknown"}</p>
          {user.username && (
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          )}
        </div>
      </div>

      <FollowButton userId={user.id} isFollowing={user.isFollowing} />
    </motion.div>
  );
}
