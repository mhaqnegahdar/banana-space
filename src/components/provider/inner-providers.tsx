import React from "react";
import { Toaster } from "sonner";
import ModalProvider from "./modal-provider";

export default function InnerProviders() {
  return (
    <>

      <ModalProvider />
      <Toaster />
    </>
  );
}
