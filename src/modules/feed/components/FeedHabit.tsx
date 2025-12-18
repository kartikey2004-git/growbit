"use client";

import { Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  habit: {
    id: string;
    name: string;
    frequency: "DAILY" | "WEEKLY";
  };
  checkedInAt: string;
  currentStreak: number;
};

export function FeedHabit({ habit, checkedInAt, currentStreak }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        checked in to{" "}
        <span className="font-medium text-foreground">{habit.name}</span>
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground whitespace-nowrap">
        <span className="flex items-center gap-1">
          <Flame className="h-3.5 w-3.5 text-orange-500" />
          {currentStreak}
        </span>

        <span>
          {formatDistanceToNow(new Date(checkedInAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
}
