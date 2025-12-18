import { Habit } from "../types/habit";
import { CheckinButton } from "./CheckinButton";
import { useState } from "react";
import { DeleteHabitModal } from "./DeleteHabitModal";

import { Button } from "@/components/ui/button";
import { Flame, Pencil, Trash2 } from "lucide-react";

type Props = {
  habit: Habit;
  onEdit: (habit: Habit) => void;
};

export function HabitCard({ habit, onEdit }: Props) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div
        className="
          group relative
          rounded-xl border bg-card
          transition-all duration-200
          hover:border-border/60 hover:shadow-sm
        "
      >
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 space-y-1">
            <h3 className="font-medium leading-tight tracking-tight truncate">
              {habit.name}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-wide">{habit.frequency}</span>

              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                {habit.currentStreak}
              </span>
            </div>
          </div>

          <CheckinButton habit={habit} />
        </div>

        <div
          className="
            flex items-center justify-end gap-1
            px-4 pb-3
            sm:absolute sm:top-3 sm:right-3 sm:p-0
          "
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(habit)}
            className="h-8 w-8 hover:bg-gray-300/40 hover:text-black"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowDelete(true)}
            className="h-8 w-8 text-destructive hover:bg-red-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showDelete && (
        <DeleteHabitModal
          habitId={habit.id}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
