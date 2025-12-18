"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "../types/types";

type Props = {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
};

function getTrophy(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export function LeaderboardRow({ entry, isCurrentUser }: Props) {
  const trophy = getTrophy(entry.rank);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`
        flex items-center justify-between
        rounded-xl border
        p-3
        bg-background
        hover:shadow-md
        ${isCurrentUser ? "border-green-500 bg-green-500/5" : ""}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-7 text-sm font-medium text-center">
          {trophy ?? `#${entry.rank}`}
        </span>

        <Avatar className="h-9 w-9">
          <AvatarImage src={entry.user.image || ""} />
          <AvatarFallback>{entry.user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {entry.user.name}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-green-600">(You)</span>
            )}
          </p>

          {entry.user.username && (
            <p className="text-xs text-muted-foreground truncate">
              @{entry.user.username}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium">
        🔥 {entry.bestStreak}
      </div>
    </motion.div>
  );
}
