import { Habit } from "../types/habit";
import { useUpdateHabit } from "../hooks/useUpdateHabit";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

type Props = {
  habit: Habit;
  onClose: () => void;
};

export function EditHabitModal({ habit, onClose }: Props) {
  const { mutate, isPending } = useUpdateHabit();
  const [name, setName] = useState(habit.name);

  const submit = () => {
    if (!name.trim()) return;
    if (name.trim() === habit.name) {
      onClose();
      return;
    }

    mutate(
      {
        habitId: habit.id,
        data: {
          name,
          frequency: habit.frequency,
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Habit"
      description="Update your habit details."
      onSubmit={submit}
      submitText={isPending ? "Saving..." : "Save Changes"}
      cancelText="Cancel"
      showFooter
    >
      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
          disabled={isPending}
          autoFocus
        />

        <p className="text-xs text-muted-foreground">
          Keep it clear and actionable.
        </p>
      </div>
    </Modal>
  );
}
