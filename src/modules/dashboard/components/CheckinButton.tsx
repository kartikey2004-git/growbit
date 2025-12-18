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
      disabled={disabled}
      onClick={() => mutate(habit.id)}
      className={`
        rounded-sm px-4
        transition-all duration-200
        ${
          isCompleted
            ? "bg-muted text-muted-foreground cursor-default"
            : "bg-[#17B100] hover:bg-[#17B100]/80 text-white"
        }
      `}
    >
      {isCompleted ? (
        <>
          <Check className="mr-1 h-4 w-4" />
          Done
        </>
      ) : (
        "Check-in"
      )}
    </Button>
  );
}
