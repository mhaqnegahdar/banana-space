"use client";

// Hooks/ Packages
import { useState, useEffect } from "react";

// Components
import AlertModal from "@/modules/modals/components/alert-modal";
import { CreateServerModal } from "@/modules/modals/components/create-server-modal";

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleMount = () => setMounted(true);
    handleMount();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AlertModal />
      <CreateServerModal />
    </>
  );
};

export default ModalProvider;
