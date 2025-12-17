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

    // Get my followers

    const followers = await db.follow.findMany({
      where: {
        followingId: session.user.id,
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },

      orderBy: {
        follower: {
          id: "desc",
        },
      },

      take: LIMIT + 1,
      cursor: cursor
        ? {
            followerId_followingId: {
              followerId: cursor,
              followingId: session.user.id,
            },
          }
        : undefined,
      skip: cursor ? 1 : 0,
    });

    const items = followers.slice(0, LIMIT).map((f) => f.follower);

    // Find which of them I follow back

    const followBack = await db.follow.findMany({
      where: {
        followerId: session.user.id,
        followingId: {
          in: items.map((u) => u.id),
        },
      },
      select: {
        followingId: true,
      },
    });

    const followingSet = new Set(followBack.map((f) => f.followingId));

    return NextResponse.json(
      {
        data: items.map((u) => ({
          ...u,
          isFollowing: followingSet.has(u.id),
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
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
