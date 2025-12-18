// Helper Function for streak calculation

import { startOfDay, subDays, startOfWeek, subWeeks } from "date-fns";

export const calculateDailyStreak = (dates: Date[]) => {
  let streak = 0;

  // Return the start of day for the given date
  let currentDay = startOfDay(new Date());

  // Continue to check for consecutive days in the set means the streak continues

  const dateSet = new Set(dates.map((date) => startOfDay(date).getTime()));

  // Check for consecutive days : if the set has the current day, increment streak and move to previous day

  while (dateSet.has(currentDay.getTime())) {
    streak++;
    currentDay = subDays(currentDay, 1);
  }

  return streak;
};

export const calculateWeeklyStreak = (dates: Date[]) => {

  // Initialize streak count and set current week to the start of the current week (Monday)

  let streak = 0;
  let currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Create a set of the start of weeks from the provided dates

  const weekSet = new Set(
    dates.map((date) => startOfWeek(date, { weekStartsOn: 1 }).getTime())
  );

  // Check for consecutive weeks : if the set has the current week, increment streak and move to previous week

  while (weekSet.has(currentWeek.getTime())) {
    streak++;
    currentWeek = startOfWeek(subWeeks(currentWeek, 1), {
      weekStartsOn: 1,
    });
  }

  return streak;
};

