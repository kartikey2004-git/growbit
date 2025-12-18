import { Habit } from "../types/habit";
import { useCheckinHabit } from "../hooks/useCheckinHabit";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Props = {
  habit: Habit;
};

export function CheckinButton({ habit }: Props) {
  const { mutate, isPending } = useCheckinHabit();

  const isCompleted = habit.completedToday;
  const disabled = isCompleted || isPending;

  return (
    <Button
      size="sm"
      disabled={disabled || isCompleted}
      onClick={() => mutate(habit.id)}
      className={`
    h-8 sm:h-9
    px-2 sm:px-4
    rounded-md
    text-xs sm:text-sm
    font-medium
    flex items-center gap-1
    transition-all duration-200
    active:scale-[0.96]
    ${
      isCompleted
        ? "bg-muted text-muted-foreground cursor-default"
        : "bg-[#17B100] text-white hover:bg-[#17B100]/80"
    }
  `}
    >
      {isCompleted ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Done</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Check-in</span>
        </>
      )}
    </Button>
  );
}
