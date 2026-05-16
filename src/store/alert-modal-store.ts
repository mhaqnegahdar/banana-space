import { create } from "zustand";

interface AlertModalStoreState {
  isOpen: boolean;
  title: string;
  description: string;
  action?: () => void;
  isSubmitting: boolean;
}

interface AlertModalStoreActions {
  open: (config: {
    title: string;
    description: string;
    action?: () => void;
  }) => void;
  close: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export type AlertModalStoreType = AlertModalStoreState & AlertModalStoreActions;

export const useAlertModalStore = create<AlertModalStoreType>((set) => ({
  // Initial state
  isOpen: false,
  title: "",
  description: "",
  action: undefined,
  isSubmitting: false,

  // Actions
  open: (config) =>
    set({
      isOpen: true,
      title: config.title,
      description: config.description,
      action: config.action,
      isSubmitting: false,
    }),

  close: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      action: undefined,
      isSubmitting: false,
    }),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));
