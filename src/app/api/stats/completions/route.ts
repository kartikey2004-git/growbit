import { NextResponse } from "next/server";
import { subDays, format, startOfDay } from "date-fns";
import db from "@/lib/database";
import { requireAuth } from "@/lib/auth/requireAuth";

const ALLOWED_RANGES = ["7d", "30d", "90d"] as const;

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const range = searchParams.get("range") ?? "30d";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!ALLOWED_RANGES.includes(range as any)) {
      return NextResponse.json({ message: "Invalid range" }, { status: 400 });
    }

    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;

    const fromDate = startOfDay(subDays(new Date(), days - 1));

    // Fetch completions

    const completions = await db.habitCompletion.findMany({
      where: {
        habit: {
          userId: session.user.id,
        },
        completedAt: {
          gte: fromDate,
        },
      },
      select: {
        completedAt: true,
      },
    });

    // Group by day
    const map = new Map<string, number>();

    for (const c of completions) {
      const key = format(c.completedAt, "yyyy-MM-dd");
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    // Fill missing days

    const data = Array.from({ length: days }).map((_, i) => {
      const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");

      return {
        date,
        count: map.get(date) ?? 0,
      };
    });

    return NextResponse.json({ range, data }, { status: 200 });
  } catch (error) {
    return error instanceof Response
      ? error
      : NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
