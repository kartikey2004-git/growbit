"use client";

import { motion } from "framer-motion";
import { useHabitStats } from "../hooks/useHabitStats";
import { HabitAnalyticsCard } from "./HabitAnalyticsCard";
import { Card } from "@/components/ui/card";

export function HabitAnalyticsList() {
  const { data, isLoading } = useHabitStats();

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <h2 className="text-sm font-medium">Habit Analytics</h2>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading habit stats…</p>
      )}

      {!isLoading && !data?.stats.length && (
        <p className="text-sm text-muted-foreground">No habits yet.</p>
      )}

      <div className="space-y-3">
        {data?.stats.map((h, i) => (
          <motion.div
            key={h.habitId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <HabitAnalyticsCard habit={h} />
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
