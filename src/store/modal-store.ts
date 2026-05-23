import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "editServer"
  | "deleteServer"
  | "inviteServer"
  | "leaveServer"
  | "members"
  | "createChannel"
  | "editChannel"
  | "deleteChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalStoreState {
  isOpen: boolean;
  type: ModalType | null;
  title: string;
  description: string;
  data?: {
    server?: unknown;
    channel?: unknown;
    apiUrl?: string;
    query?: Record<string, string>;
    inviteCode?: string;
  };
  isSubmitting: boolean;
}

interface ModalStoreActions {
  open: (config: {
    type: ModalType;
    title: string;
    description: string;
    data?: ModalStoreState["data"];
  }) => void;
  close: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export type ModalStoreType = ModalStoreState & ModalStoreActions;

export const useModalStore = create<ModalStoreType>((set) => ({
  isOpen: false,
  type: null,
  title: "",
  description: "",
  data: undefined,
  isSubmitting: false,

  open: (config) => {
    console.log("first");
    return set({
      isOpen: true,
      type: config.type,
      title: config.title,
      description: config.description,
      data: config.data,
      isSubmitting: false,
    });
  },

  close: () =>
    set({
      isOpen: false,
      type: null,
      title: "",
      description: "",
      data: undefined,
      isSubmitting: false,
    }),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));
