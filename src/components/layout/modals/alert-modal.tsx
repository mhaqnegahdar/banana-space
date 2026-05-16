"use client";

// Hooks / Packages
import { useAlertModalStore } from "@/store/alert-modal-store"; // Adjust path as needed
// Component
import Modal from "@/components/layout/modals/modal";
import { Button } from "@/components/ui/button";

const AlertModal = () => {
  const {
    isOpen,
    title,
    description,
    action,
    isSubmitting,
    close,
    setSubmitting,
  } = useAlertModalStore();

  const handleAction = async () => {
    if (!action) return;

    try {
      setSubmitting(true);
      await action();
      // close(); // Close modal after successful action
    } catch (error) {
      console.error("Action failed:", error);
      // Handle error as needed - maybe show toast notification
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => close()}
      title={title}
      description={description}
    >
      {/* Buttons */}
      <div className="pt-6 gap-2 flex items-center justify-end w-full">
        <Button
          type="reset"
          size={"sm"}
          variant={"secondary"}
          className="mt-4"
          disabled={isSubmitting}
          onClick={() => {
            close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant={"destructive"}
          size={"sm"}
          type="submit"
          className="mt-4"
          disabled={isSubmitting}
          onClick={handleAction}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
