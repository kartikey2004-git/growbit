"use client";

import { motion } from "framer-motion";
import { FeedItem } from "../types/types";
import { FeedHabit } from "./FeedHabit";
import { FeedUser } from "./FeedUser";

type Props = {
  item: FeedItem;
};

export function FeedItemCard({ item }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="
        rounded-xl border
        bg-card
        p-4
        space-y-3
        hover:shadow-md
      "
    >
      <FeedUser user={item.user} />

      <FeedHabit
        habit={item.habit}
        checkedInAt={item.checkedInAt}
        currentStreak={item.currentStreak}
      />
    </motion.div>
  );
}
