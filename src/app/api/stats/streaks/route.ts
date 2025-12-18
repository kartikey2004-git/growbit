// API related to streaks and completions

import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";
import { NextResponse } from "next/server";

const STREAK_WINDOW = 60;

export async function GET() {
  try {
    const session = await requireAuth();

    // Find habits related to user and their completions in descending order

    const habits = await db.habit.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        frequency: true,
        completions: {
          select: {
            completedAt: true,
          },
          orderBy: {
            completedAt: "desc",
          },
          take: STREAK_WINDOW,
        },
        _count: {
          select: {
            completions: true,
          },
        },
      },
    });

    const stats = habits.map((habit) => {
      const dates = habit.completions.map((c) => c.completedAt);

      const currentStreak =
        habit.frequency === "DAILY"
          ? calculateDailyStreak(dates)
          : calculateWeeklyStreak(dates);

      return {
        habitId: habit.id,
        name: habit.name,
        frequency: habit.frequency,
        currentStreak,
        totalCompletions: habit._count.completions,
      };
    });

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error in getting stats for streaks", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
