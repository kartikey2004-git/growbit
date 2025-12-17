import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

// function to get the start and end date of the current check-in period

export function getCheckinRange(frequency: "DAILY" | "WEEKLY") {
  const now = new Date();

  // for daily habits, return start and end of the current day

  if (frequency === "DAILY") {
    return {
      from: startOfDay(now),
      to: endOfDay(now),
    };
  }

  // for weekly habits, return start and end of the current week (week starts on Monday)
  
  return {
    from: startOfWeek(now, { weekStartsOn: 1 }),
    to: endOfWeek(now, { weekStartsOn: 1 }),
  };
}
