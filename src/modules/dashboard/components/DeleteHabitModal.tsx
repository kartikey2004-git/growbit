import { useDeleteHabit } from "../hooks/useDeleteHabit";
import Modal from "@/components/ui/modal";

type Props = {
  habitId: string;
  onClose: () => void;
};

export function DeleteHabitModal({ habitId, onClose }: Props) {
  const { mutate, isPending } = useDeleteHabit();

  const submit = () => {
    mutate(habitId, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Delete Habit"
      description="This action cannot be undone. All progress and streak data for this habit will be permanently removed."
      onSubmit={submit}
      submitText={isPending ? "Deleting..." : "Delete Habit"}
      cancelText="Cancel"
      submitVariant="destructive"
      showFooter
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
        Are you sure you want to delete this habit?
      </div>
    </Modal>
  );
}
