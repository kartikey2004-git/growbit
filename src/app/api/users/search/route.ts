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
    const query = searchParams.get("q")?.trim();
    const cursor = getCursor(searchParams);

    if (!query || query.length < 2) {
      return NextResponse.json({ data: [], nextCursor: null }, { status: 200 });
    }

    const users = await db.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    const sliced = users.slice(0, LIMIT);

    const follows = await db.follow.findMany({
      where: {
        followerId: userId,
        followingId: {
          in: sliced.map((u) => u.id),
        },
      },
      select: {
        followingId: true,
      },
    });

    const followedSet = new Set(follows.map((f) => f.followingId));

    return NextResponse.json(
      {
        data: sliced.map((u) => ({
          ...u,
          isFollowing: followedSet.has(u.id),
        })),
        nextCursor: getNextCursor({
          items: sliced,
          limit: LIMIT,
          getCursor: (u) => u.id,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in searching users", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
