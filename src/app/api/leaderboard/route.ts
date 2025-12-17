import db from "@/lib/database";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch users with habits and completions
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        habits: {
          include: {
            completions: {
              orderBy: {
                completedAt: "desc",
              },
            },
          },
        },
      },
    });

    // Compute best streak per user : daily or weekly based on habit frequency and filter out users with no streaks and sort by difference of best streaks and take top 20

    const leaderboard = users
      .map((user) => {
        let bestStreak = 0;

        for (const habit of user.habits) {
          const dates = habit.completions.map((c) => c.completedAt);

          if (dates.length === 0) continue;

          const streak =
            habit.frequency === "DAILY"
              ? calculateDailyStreak(dates)
              : calculateWeeklyStreak(dates);

          bestStreak = Math.max(bestStreak, streak);
        }

        return {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
          },
          bestStreak,
        };
      })
      .filter((u) => u.bestStreak > 0)
      .sort((a, b) => b.bestStreak - a.bestStreak)
      .slice(0, 20); // top 20

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching leaderboard data", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
