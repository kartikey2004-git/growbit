// API related to follow / unfollow user

import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const userId = session.user.id;
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json(
        { message: "targetUserId is required" },
        { status: 400 }
      );
    }

    // Prevent to self follow

    if (userId === targetUserId) {
      return NextResponse.json(
        { message: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following the another user

    const existingFollow = await prisma?.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    // Toggle follow / unfollow

    if (existingFollow) {
      // Unfollow the user
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });

      return NextResponse.json({ followed: false }, { status: 200 });
    }

    // Follow the user

    await db.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });

    return NextResponse.json({ followed: true }, { status: 201 });
  } catch (error) {
    console.error("Error in follow/unfollow user", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
