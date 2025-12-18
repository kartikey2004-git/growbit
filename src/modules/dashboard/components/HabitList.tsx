import { Habit } from "../types/habit";
import { HabitCard } from "./HabitCard";

type Props = {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
};

export function HabitList({ habits, onEdit }: Props) {
  if (!habits.length) {
    return (
      <div className="text-sm text-gray-500 text-center">
        No habits yet. Create your first one.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
      ))}
    </div>
  );
}
