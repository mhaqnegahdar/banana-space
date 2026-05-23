"use client";

import { useState } from "react";

import ChatInterface from "@/modules/chat/components/chat-interface";
import type { Channel } from "@/modules/navigation/components/app-sidebar";

export default function Page() {
  // "sidebars" = show sidebar panel fullscreen on mobile
  // "chat"     = show chat fullscreen on mobile
  const [mobileView, setMobileView] = useState<"sidebars" | "chat">("sidebars");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const channelName = activeChannel?.name ?? "general";

  return (
    <>
      <ChatInterface channelName={channelName} />
    </>
  );
}
