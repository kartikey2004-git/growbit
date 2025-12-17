import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";
import { HabitSchema } from "@/lib/validators/habit";
import { isSameDay, isSameWeek } from "date-fns";
import { NextResponse } from "next/server";
import z from "zod";

// POST (create a habit )

/*

Create Habit API : Order of creating a habit

   1. Define contract (what the API expects & returns)

   2. Zod validation
   3. API route (Next.js App Router)
   4. Edge cases (duplicate habit, auth, validation)
   
   5. How TanStack Query will consume this


-----------------------------------------------

1️. API Contract (Lock This First)
Endpoint : POST /api/habits

Request body :
{
  name: string;
  frequency: "DAILY" | "WEEKLY";
  categoryId?: string;
}

Success response
{
  habit: Habit
}

Error cases

   - 401 → not authenticated
   - 400 → validation error
   - 409 → duplicate habit name (per user)

Locking this early avoids frontend-backend mismatch later.


2. Zod Schema (Single Source of Truth)

Why this matters

   - Same schema → API + frontend form
   - No silent bugs from mismatched validation

-----------------------------------------------

Implementation:
   
    - Duplicate habit protection
      - Case-insensitive
      - Scoped per user
      - Prevents UX confusion later
    
    - Auth handled server-side
      - No trust on frontend
      - Secure by default
    
    - Validation before DB hit
      - Avoids unnecessary queries
      - Clean error responses

  
      Bugs Faced earlier : 

        - Calculating frequency logic during creation
        - Using new Date() blindly (timezone bugs later)

*/

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    // Parse and validate the body
    const body = await req.json();

    // Zod validation for the request body before creating a habit

    const parsed = HabitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const { name, frequency, categoryId } = parsed.data;

    // Prevent duplicate habit for the same user by name (case insensitive) : edge case

    const existingHabit = await db.habit.findFirst({
      where: {
        userId: session.user.id,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingHabit) {
      return NextResponse.json(
        { message: "Habit with this name already exists" },
        { status: 409 }
      );
    }

    // Create habit for the authenticated user

    const habit = await db.habit.create({
      data: {
        name,
        frequency,
        categoryId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// GET (list of habits )

/*

  We need to focus on somethings:
     
     - What GET /api/habits should return
     - How streak + completion is calculated (DAILY & WEEKLY)

     - The actual API route code
     - Why this approach scales
     - How TanStack Query consumes it

---------------------------------------------

1. What the Dashboard Actually Needs (API Contract)

Endpoint
GET /api/habits

Response shape (what frontend really needs)
{
habits: Array<{
    id: string;
    name: string;
    frequency: "DAILY" | "WEEKLY";
    categoryId?: string;
    createdAt: Date;

    completedToday: boolean;
    currentStreak: number;
    completionRate: number; // %
  }>;
}

- Important : backend responsibilities.
   
   - Frontend should NOT calculate streaks.
   - Frontend should NOT figure out “completed today”.

  
2. How Streak Logic Works
   
  - DAILY habit

      1. Look at completion dates for today and previous days

      2. start from today, count backwards until a miss
      
      3. count how many consecutive days backwards have completions of habits

  - Weekly habit
    
    - Group completions by week (Mon-Sun) : group completion means if a habit is completed at least once in that week

    - Count how many consecutive weeks have ≥1 habit completion, starting from current week backwards until a miss

  If a day/week is missed → streak breaks.

-----------------------------------------------

   - Production-Grade API's

     - One DB query
     - No frontend calculations
     - Handles DAILY & WEEKLY correctly
     - Safe for future analytics
     - Easy to cache with TanStack Query
    
   - This endpoint alone powers:
     
     - Dashboard
     - Charts
     - Streak UI
     - Completion indicators

*/

export async function GET() {
  try {
    const session = await requireAuth();

    // Fetch habits with completions from the database in reverse chronological order

    const habits = await prisma?.habit.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        completions: {
          orderBy: { completedAt: "desc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Now we have to transform habits to include completedToday, currentStreak, completionRate

    const today = new Date();

    const formattedHabits = habits?.map((habit) => {
      // Extract completion dates
      const completionDates = habit.completions.map((c) => c.completedAt);

      // Check if completed today (for DAILY) or this week (for WEEKLY)

      const completedToday =
        habit.frequency === "DAILY"
          ? completionDates.some((d) => isSameDay(d, today))
          : completionDates.some((d) =>
              isSameWeek(d, today, { weekStartsOn: 1 })
            );

      // Calculate current streak based on frequency

      const currentStreak =
        habit.frequency === "DAILY"
          ? calculateDailyStreak(completionDates)
          : calculateWeeklyStreak(completionDates);

      // Calculate completion rate
      const completionRate =
        habit.completions.length === 0
          ? 0
          : Math.round(
              (habit.completions.length /
                Math.max(1, habit.completions.length + 5)) *
                100
            );

      return {
        id: habit.id,
        name: habit.name,
        frequency: habit.frequency,
        categoryId: habit.categoryId,
        createdAt: habit.createdAt,

        completedToday,
        currentStreak,
        completionRate,
      };
    });

    return NextResponse.json({ habits: formattedHabits }, { status: 200 });
  } catch (error) {
    console.error("GET_HABITS_ERROR", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
