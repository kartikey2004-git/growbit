// API for friends activity feed

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { getCursor } from "@/lib/api/getCursor";
import { getNextCursor } from "@/lib/db/pagination";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";

const LIMIT = 10;

export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    const userId = user.session.id;

    const { searchParams } = new URL(req.url);
    const cursor = getCursor(searchParams);

    // Get all the users that the current user is following

    const following = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return NextResponse.json({ data: [], nextCursor: null }, { status: 200 });
    }

    // Fetch recent habit completions from followed users

    const completions = await db.habitCompletion.findMany({
      where: {
        habit: {
          userId: {
            in: followingIds,
          },
        },
      },

      include: {
        habit: {
          include: {
            user: true,
            completions: {
              orderBy: { completedAt: "desc" },
            },
          },
        },
      },

      orderBy: [{ completedAt: "desc" }, { id: "desc" }],

      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    const items = completions.slice(0, LIMIT);

    // Format the feed data : user info, habit info, completion info

    const feed = items.map((completion) => {
      const habit = completion.habit;
      const completionDates = habit.completions.map((c) => c.completedAt);

      const currentStreak =
        habit.frequency === "DAILY"
          ? calculateDailyStreak(completionDates)
          : calculateWeeklyStreak(completionDates);

      return {
        user: {
          id: habit.user.id,
          name: habit.user.name,
          username: habit.user.username,
          image: habit.user.image,
        },
        habit: {
          id: habit.id,
          name: habit.name,
          frequency: habit.frequency,
        },
        checkedInAt: completion.completedAt,
        currentStreak,
      };
    });

    return NextResponse.json(
      {
        data: feed,
        nextCursor: getNextCursor({
          items,
          limit: LIMIT,
          getCursor: (i) => i.id,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching feed", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
