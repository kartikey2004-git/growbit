import { Button } from "@/components/ui/button";

type Props = {
  onCreate: () => void;
};

export function DashboardHeader({ onCreate }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Habits</h1>
        <p className="text-sm text-muted-foreground">
          Build consistency, one day at a time
        </p>
      </div>

      <Button onClick={onCreate} className="rounded-lg">
        + New Habit
      </Button>
    </div>
  );
}
