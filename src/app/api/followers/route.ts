import { getCursor } from "@/lib/api/getCursor";
import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { getNextCursor } from "@/lib/db/pagination";
import { NextResponse } from "next/server";

const LIMIT = 10;

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const cursor = getCursor(searchParams);

    const followers = await db.follow.findMany({
      where: {
        followingId: userId,
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
        followerId: "desc",
      },
      take: LIMIT + 1,
      cursor: cursor
        ? {
            followerId_followingId: {
              followerId: cursor,
              followingId: userId,
            },
          }
        : undefined,
      skip: cursor ? 1 : 0,
    });

    const sliced = followers.slice(0, LIMIT);
    const users = sliced.map((f) => f.follower);

    // Follow-back status
    const followBack = await db.follow.findMany({
      where: {
        followerId: userId,
        followingId: {
          in: users.map((u) => u.id),
        },
      },
      select: {
        followingId: true,
      },
    });

    const followingSet = new Set(followBack.map((f) => f.followingId));

    return NextResponse.json(
      {
        data: users.map((u) => ({
          ...u,
          isFollowing: followingSet.has(u.id),
        })),
        nextCursor: getNextCursor({
          items: sliced,
          limit: LIMIT,
          getCursor: (f) => f.follower.id,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
