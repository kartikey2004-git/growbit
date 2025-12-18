"use client";

import { LeaderboardList } from "@/modules/leaderboard/components/LeaderBoardList";
import { motion } from "framer-motion";


export default function LeaderboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        w-full
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        space-y-6
      "
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Top streaks across the community
        </p>
      </div>

      <LeaderboardList />
    </motion.div>
  );
}
