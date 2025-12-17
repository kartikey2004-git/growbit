-- DropForeignKey
ALTER TABLE "public"."HabitCompletion" DROP CONSTRAINT "HabitCompletion_habitId_fkey";

-- AddForeignKey
ALTER TABLE "HabitCompletion" ADD CONSTRAINT "HabitCompletion_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
