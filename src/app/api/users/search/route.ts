// API related to search users

import { getCursor } from "@/lib/api/getCursor";
import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { getNextCursor } from "@/lib/db/pagination";
import { NextResponse } from "next/server";

const LIMIT = 10;

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    // get current user id and get search query params for searching users on basis of it

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const cursor = getCursor(searchParams);

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // Search users
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
      orderBy: [{ id: "desc" }],
      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    if (users.length === 0) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // Slice for pagination
    const items = users.slice(0, LIMIT);

    // Find the users who I am already following from the searched users

    const follows = await db.follow.findMany({
      where: {
        followerId: userId,
        followingId: {
          in: items.map((user) => user.id),
        },
      },
      select: {
        followingId: true,
      },
    });

    // Create a set of followed user IDs for quick lookup

    const followedSet = new Set(follows.map((f) => f.followingId));

    // Attach isFollowing flag

    const result = items.map((user) => ({
      ...user,
      isFollowing: followedSet.has(user.id),
    }));

    return NextResponse.json(
      {
        users: result,
        nextCursor: getNextCursor({
          items,
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
