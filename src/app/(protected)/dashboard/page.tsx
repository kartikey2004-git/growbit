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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="
          w-full
          px-4 sm:px-6 lg:px-8
          py-5
        "
      >
        <div
          className="
            rounded-2xl
            border
            bg-background
            shadow-sm
          "
        >
          <div className="p-4 sm:p-6 space-y-6">
            <DashboardHeader onCreate={() => setIsCreateOpen(true)} />

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
