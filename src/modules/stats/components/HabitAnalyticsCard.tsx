"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { HabitStat } from "../types/types";

type Props = {
  habit: HabitStat;
};

export function HabitAnalyticsCard({ habit }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="
        rounded-xl border
        p-4
        flex items-center justify-between
        bg-background
        hover:shadow-md
        cursor-pointer
      "
    >
      <div className="space-y-1">
        <p className="font-medium leading-none">{habit.name}</p>
        <p className="text-xs text-muted-foreground">{habit.frequency}</p>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-1 font-medium">
          <Flame className="h-4 w-4 text-orange-500" />
          {habit.currentStreak}
        </span>

        <span className="text-muted-foreground">{habit.totalCompletions}</span>
      </div>
    </motion.div>
  );
}
