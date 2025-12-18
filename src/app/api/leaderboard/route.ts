export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";
import { isSameWeek } from "date-fns";
import { NextResponse } from "next/server";

const MAX_COMPLETIONS = 60;
const LEADERBOARD_LIMIT = 20;

export const revalidate = 60; // aggressive caching

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "all";

    // Fetch users with habits and completions
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        habits: {
          select: {
            frequency: true,
            completions: {
              select: { completedAt: true },
              orderBy: { completedAt: "desc" },
              take: MAX_COMPLETIONS,
            },
          },
        },
      },
    });

    // Compute best streak per user : daily or weekly based on habit frequency and filter out users with no streaks and sort by difference of best streaks and take top 20

    const now = new Date();

    const computed = users.map((user) => {
      let bestStreak = 0;

      for (const habit of user.habits) {
        let dates = habit.completions.map((c) => c.completedAt);

        if (range === "weekly") {
          dates = dates.filter((d) => isSameWeek(d, now, { weekStartsOn: 1 }));
        }

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
    });

    const sorted = computed
      .filter((u) => u.bestStreak > 0)
      .sort((a, b) => {
        if (b.bestStreak !== a.bestStreak) {
          return b.bestStreak - a.bestStreak;
        }
        return a.user.name?.localeCompare(b.user.name ?? "") ?? 0;
      })
      .slice(0, LEADERBOARD_LIMIT)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    const currentUserRank =
      sorted.find((u) => u.user.id === userId)?.rank ?? null;

    return NextResponse.json(
      { data: sorted, currentUserRank },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching leaderboard data", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
