import React from "react";
import { Toaster } from "sonner";
import ModalProvider from "./modal-provider";
import { ThemeToggle } from "../layout/theme-toggle";

export default function InnerProviders() {
  return (
    <>
      <div className="fixed bottom-5 right-5">
        <ThemeToggle />
      </div>
      <ModalProvider />
      <Toaster />
    </>
  );
}
