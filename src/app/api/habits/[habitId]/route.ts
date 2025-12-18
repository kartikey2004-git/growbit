import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import db from "@/lib/database";
import { HabitSchema } from "@/lib/validators/habit";
import z from "zod";

type Params = {
  params: Promise<{
    habitId: string;
  }>;
};


export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { habitId } = await params;

    if (!habitId) {
      return NextResponse.json(
        { message: "Habit ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = HabitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: z.treeifyError(parsed.error) },
        { status: 400 }
      );
    }

    const habit = await db.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedHabit = await db.habit.update({
      where: { id: habitId },
      data: parsed.data,
    });

    return NextResponse.json({ habit: updatedHabit }, { status: 200 });
  } catch (error) {
    console.error("UPDATE_HABIT_ERROR", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { habitId } = await params;

    if (!habitId) {
      return NextResponse.json(
        { message: "Habit ID is required" },
        { status: 400 }
      );
    }

    const habit = await db.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

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
