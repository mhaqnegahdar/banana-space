"use client";

// Hooks/ Packages
import { useState, useEffect } from "react";

// Components
import AlertModal from "@/components/layout/modals/alert-modal";

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
    </>
  );
};

export default ModalProvider;
