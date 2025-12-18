export type HabitFrequency = "DAILY" | "WEEKLY";

export type Habit = {
  id: string;
  name: string;
  frequency: HabitFrequency;
  categoryId?: string | null;
  createdAt: string;
  completedToday: boolean;
  currentStreak: number;
  completionRate: number;
};
