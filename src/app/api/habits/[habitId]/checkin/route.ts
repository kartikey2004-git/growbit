// POST check-in daily/weekly habits

/*

  - If check-in logic is wrong, streaks, leaderboard, reminders — everything breaks.

1. Check-in Rules (Lock These Mentally)
     
  - Daily habit
       
    - User can check in once per calendar day
    - Day = local day (not 24 hours rolling window)

  - Weekly habit
      
    - User can check in once per calendar week
    - Week starts on Monday (important for consistency)

    
  Rules : 
      
    - Cannot check in for someone else’s habit
    - Cannot check in twice in same day/week
    - Check-in is append-only (never update old ones)

-----------------------------------------------

2. API EndPoint
POST /api/habits/:habitId/checkin

Sucess message: 
{
  message: "Check-in successful"
}

Errors

401	Not authenticated
403	Habit doesn’t belong to user
409	Already checked in
404	Habit not found

-----------------------------------------------


*/

import { NextResponse } from "next/server";
import { getCheckinRange } from "@/lib/utils/checkin";
import db from "@/lib/database";
import { requireAuth } from "@/lib/auth/requireAuth";

type Params = {
  params: {
    habitId: string;
  };
};

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();

    const userId = session.user.id;
    const habitId = params.habitId;

    // Fetch the habit to ensure it exists and belongs to the user

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

    // Ownership check

    if (habit.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Check existing check-ins in the current period of the habit's frequency

    const { from, to } = getCheckinRange(habit.frequency);

    const alreadyCheckedIn = await db.habitCompletion.findFirst({
      where: {
        habitId,
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

    // Create the check-in for the habit

    await db.habitCompletion.create({
      data: {
        habitId,
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
