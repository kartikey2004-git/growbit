/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { LeaderboardRow } from "./LeaderboardRow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function LeaderboardList() {
  const [range, setRange] = useState<"all" | "weekly">("all");
  const { data, isLoading } = useLeaderboard(range);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium">Rankings</h2>

        <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground"
          >
            Loading leaderboard…
          </motion.p>
        ) : (
          <motion.div
            key={range}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2"
          >
            {data?.data.map((entry, i) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={entry.rank === data.currentUserRank}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
