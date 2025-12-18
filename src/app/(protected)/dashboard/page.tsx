"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { useHabits } from "../../../modules/dashboard/hooks/useHabits";
import { DashboardHeader } from "../../../modules/dashboard/components/DashBoardHeader";
import { HabitList } from "../../../modules/dashboard/components/HabitList";
import { CreateHabitModal } from "../../../modules/dashboard/components/CreateHabitModal";
import { EditHabitModal } from "../../../modules/dashboard/components/EditHabitModal";
import { Habit } from "../../../modules/dashboard/types/habit";

export default function Dashboard() {
  const { data: habits = [] } = useHabits();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full px-3 sm:px-6 lg:px-8 py-4"
      >
        <div
          className="
            bg-background
            sm:rounded-2xl
            sm:border
            sm:shadow-sm
          "
        >
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur sm:static sm:bg-transparent">
            <div className="px-1 sm:px-6 pt-2 sm:pt-6 pb-3 border-b sm:border-none">
              <DashboardHeader onCreate={() => setIsCreateOpen(true)} />
            </div>
          </div>

          <div className="px-1 sm:px-6 py-3 sm:py-4">
            <HabitList habits={habits} onEdit={setEditingHabit} />
          </div>
        </div>
      </motion.div>

      {isCreateOpen && (
        <CreateHabitModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </>
  );
}
