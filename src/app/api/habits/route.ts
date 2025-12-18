import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import {
  calculateDailyStreak,
  calculateWeeklyStreak,
} from "@/lib/utils/streak";
import { HabitSchema } from "@/lib/validators/habit";
import { differenceInDays, isSameDay, isSameWeek } from "date-fns";
import { NextResponse } from "next/server";
import z from "zod";

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

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // Fetch habits with completions from the database in reverse chronological order

    const habits = await db.habit.findMany({
      where: {
        userId: userId,
      },
      include: {
        completions: {
          select: { completedAt: true },
          orderBy: { completedAt: "desc" },
          take: 60,
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

      const daysSinceCreation = Math.max(
        1,
        differenceInDays(today, habit.createdAt) + 1
      );

      // Calculate completion rate
      const completionRate = Math.round(
        (habit.completions.length / daysSinceCreation) * 100
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

    return NextResponse.json({ formattedHabits }, { status: 200 });
  } catch (error) {
    console.error("GET_HABITS_ERROR", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
