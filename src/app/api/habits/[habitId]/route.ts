// PATCH, DELETE particular habit

import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { HabitSchema } from "@/lib/validators/habit";
import { NextResponse } from "next/server";
import z from "zod";

type Params = {
  params: {
    habitId: string;
  };
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();

    const userId = session.user.id;
    const habitId = params.habitId;

    // Parse and validate the body
    const body = await req.json();

    // Zod validation for the request body before updating a habit

    const parsed = HabitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    // Fetch the habit from existing database

    const habit = await db.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Prevent duplicate name (only if name is changing) means if the new name is different from the existing name : edge case

    if (parsed.data.name) {
      const duplicate = await db.habit.findFirst({
        where: {
          userId,
          name: {
            equals: parsed.data.name,
            mode: "insensitive",
          },
          NOT: {
            id: habitId,
          },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { message: "Habit with this name already exists" },
          { status: 409 }
        );
      }
    }

    // Update habit

    const updatedHabit = await db.habit.update({
      where: {
        id: habitId,
      },
      data: parsed.data,
    });

    return NextResponse.json({ habit: updatedHabit }, { status: 200 });
  } catch (error) {
    console.error("Error in updating habit", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    // Auth check : user is authorised or not
    const session = await requireAuth();

    const userId = session.user.id;
    const habitId = params.habitId;

    // Fetch habit from the database

    const habit = await db.habit.findUnique({
      where: {
        id: habitId,
      },
    });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete a particular habit and also include its completions : cascade

    await db.habit.delete({
      where: { id: habitId },
    });

    return NextResponse.json(
      { message: "Habit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_HABIT_ERROR", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
