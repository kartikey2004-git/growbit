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
      <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border bg-card px-4 py-3 transition-all hover:border-border/60 hover:shadow-sm">
        <div className="min-w-0 space-y-1">
          <h3 className="font-medium leading-tight truncate">{habit.name}</h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="uppercase tracking-wide">{habit.frequency}</span>

            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              {habit.currentStreak}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckinButton habit={habit} />

          <div className="hidden sm:flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(habit)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowDelete(true)}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>


        <div className="flex sm:hidden justify-end gap-1 pt-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(habit)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowDelete(true)}
            className="h-8 w-8 text-destructive"
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
