import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { getCheckinRange } from "@/lib/utils/checkin";
import db from "@/lib/database";

type Params = {
  params: Promise<{
    habitId: string;
  }>;
};

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { habitId } = await params;

    if (!habitId) {
      return NextResponse.json(
        { message: "Habit ID is required" },
        { status: 400 }
      );
    }

    // Fetch habit + ownership + frequency
    const habit = await db.habit.findUnique({
      where: { id: habitId },
      select: {
        id: true,
        userId: true,
        frequency: true,
      },
    });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Determine valid check-in window (day / week)
    const { from, to } = getCheckinRange(habit.frequency);

    const alreadyCheckedIn = await db.habitCompletion.findFirst({
      where: {
        habitId: habit.id,
        completedAt: {
          gte: from,
          lte: to,
        },
      },
    });

    if (alreadyCheckedIn) {
      return NextResponse.json(
        { message: "Already checked in" },
        { status: 409 }
      );
    }

    // Append-only check-in
    await db.habitCompletion.create({
      data: {
        habitId: habit.id,
      },
    });

    return NextResponse.json(
      { message: "Check-in successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CHECKIN_ERROR", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
