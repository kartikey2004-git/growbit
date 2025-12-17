// API to fetch a list of following users

import { getCursor } from "@/lib/api/getCursor";
import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { getNextCursor } from "@/lib/db/pagination";
import { NextResponse } from "next/server";

const LIMIT = 10;

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const cursor = getCursor(searchParams);

    // GET all the users I follow

    const follows = await db.follow.findMany({
      where: {
        followerId: session.user.id,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },

      orderBy: {
        following: {
          id: "desc",
        },
      },

      take: LIMIT + 1,
      cursor: cursor
        ? {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: cursor,
            },
          }
        : undefined,
      skip: cursor ? 1 : 0,
    });

    const items = follows.slice(0, LIMIT).map((f) => f.following);

    return NextResponse.json(
      {
        data: items.map((u) => ({
          ...u,
          isFollowing: true, // I already follow them
        })),
        nextCursor: getNextCursor({
          items,
          limit: LIMIT,
          getCursor: (u) => u.id,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getting following users", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
