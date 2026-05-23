"use client";

import { useModalStore } from "@/store/modal-store";
import { CreateServerModal } from "./create-server-modal";

export function InitialModal() {
  const { open } = useModalStore();

  open({
    type: "createServer",
    title: "",
    description: "",
  });

  return <CreateServerModal forceOpen />;
}
