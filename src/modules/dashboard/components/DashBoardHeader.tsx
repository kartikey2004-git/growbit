import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
};

export function DashboardHeader({ onCreate }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Your Habits
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Build consistency, one day at a time
        </p>
      </div>

      <Button
        onClick={onCreate}
        className="
          w-full sm:w-auto
          h-9
          rounded-lg
          bg-[#17B100] text-white
          hover:bg-[#17B100]/80
        "
      >
        + New Habit
      </Button>
    </div>
  );
}
