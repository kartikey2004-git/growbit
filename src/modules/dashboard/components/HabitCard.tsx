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
          group relative flex items-center justify-between
          rounded-xl border bg-card p-4
          transition-all duration-200
          hover:border-border/60 hover:shadow-sm
        "
      >
        <div className="space-y-1">
          <h3 className="font-medium leading-none tracking-tight">
            {habit.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase tracking-wide">{habit.frequency}</span>

            <span>•</span>

            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Streak {habit.currentStreak}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckinButton habit={habit} />

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(habit)}
            className="hover:bg-gray-300/40 hover:text-black"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:bg-red-600 hover:text-white"
            onClick={() => setShowDelete(true)}
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
