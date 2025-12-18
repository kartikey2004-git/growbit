export type CompletionPoint = {
  date: string; 
  count: number;
};

export type CompletionStatsResponse = {
  data: {
    range: "7d" | "30d" | "90d";
    days: number;
    series: CompletionPoint[];
  };
};

export type HabitStat = {
  habitId: string;
  name: string;
  frequency: "DAILY" | "WEEKLY";
  currentStreak: number;
  totalCompletions: number;
};

export type HabitStatsResponse = {
  stats: HabitStat[];
};
