"use client";

import { motion } from "framer-motion";
import { CompletionStatsSection } from "@/modules/stats/components/CompleteStatsSection";
import { HabitAnalyticsList } from "@/modules/stats/components/HabitAnalyticsList";

export default function StatsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        w-full
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        space-y-8
      "
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Stats & Insights
        </h1>
        <p className="text-sm text-muted-foreground">
          Visualize consistency, streaks, and habit performance
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CompletionStatsSection />
        <HabitAnalyticsList />
      </div>
    </motion.div>
  );
}
