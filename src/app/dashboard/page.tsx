"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileSidebarNav } from "@/components/mobile-sidebar-nav";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "@/modules/chat/components/chat-interface";
import type { Channel } from "@/components/app-sidebar";

export default function Page() {
  // "sidebars" = show sidebar panel fullscreen on mobile
  // "chat"     = show chat fullscreen on mobile
  const [mobileView, setMobileView] = useState<"sidebars" | "chat">("sidebars");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const channelName = activeChannel?.name ?? "general";

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    setMobileView("chat");
  };

  const handleBackToSidebars = () => {
    setMobileView("sidebars");
  };

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "350px" } as React.CSSProperties}
    >
      {/* Desktop sidebar (hidden on mobile) */}
      <AppSidebar />

      {/* Mobile sidebar (hidden on desktop) */}
      <MobileSidebarNav
        view={mobileView}
        onChannelSelect={handleChannelSelect}
      />

      {/* Main content */}
      <SidebarInset
        className={
          // On mobile: hide chat when sidebars are shown; show chat when in chat view
          mobileView === "sidebars" ? "hidden md:flex" : "flex"
        }
      >
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background px-4 h-14">
          {/* Desktop: shadcn SidebarTrigger */}
          <div className="hidden md:block">
            <SidebarTrigger className="-ml-1" />
          </div>

          {/* Mobile: back arrow → returns to sidebars */}
          <button
            className="md:hidden p-1 rounded-md hover:bg-accent transition-colors"
            onClick={handleBackToSidebars}
            aria-label="Back to channels"
          >
            <ArrowLeft className="size-5" />
          </button>

          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <span className="text-sm font-medium text-muted-foreground">
            # {channelName}
          </span>
        </header>

        <ChatInterface channelName={channelName} />
      </SidebarInset>
    </SidebarProvider>
  );
}
