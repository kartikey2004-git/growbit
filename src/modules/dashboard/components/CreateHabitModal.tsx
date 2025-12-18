import { useCreateHabit } from "../hooks/useCreateHabit";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateHabitModal({ isOpen, onClose }: Props) {
  const { mutate, isPending } = useCreateHabit();
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) return;

    mutate({ name: name.trim(), frequency: "DAILY" }, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Habit"
      description="Start building a new habit you want to stay consistent with."
      onSubmit={submit}
      submitText={isPending ? "Creating..." : "Create Habit"}
      cancelText="Cancel"
      showFooter
    >
      <div className="space-y-2">
        <Input
          placeholder="e.g. Morning workout"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          disabled={isPending}
        />

        <p className="text-xs text-muted-foreground">
          Keep it short and actionable.
        </p>
      </div>
    </Modal>
  );
}
