import { z } from "zod";

export const HabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(50, "Habit name too long"),
  frequency: z.enum(["DAILY", "WEEKLY"]),
  categoryId: z.string().nullable().optional(),
});

// Infer TypeScript type from Zod schema

export type HabitInput = z.infer<typeof HabitSchema>;
