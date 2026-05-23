"use client";

import { useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { MobileSidebarNav } from "./mobile-sidebar-nav";
import type { Server, Channel, ChannelGroup } from "./app-sidebar";

interface ServerLayoutClientProps {
  servers: Server[];
  activeServer: Server;
  groups: ChannelGroup[];
  children: React.ReactNode;
}

// Client — owns mobileView state and active channel name for the header.
// Wraps the mobile nav + the main content area.
export function ServerLayoutClient({
  servers,
  activeServer,
  groups,
  children,
}: ServerLayoutClientProps) {
  const [mobileView, setMobileView] = useState<"sidebars" | "chat">("sidebars");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const channelName = activeChannel?.name ?? "general";

  function handleChannelSelect(channel: Channel) {
    setActiveChannel(channel);
    setMobileView("chat");
  }

  return (
    <>
      <MobileSidebarNav
        servers={servers}
        initialActiveServer={activeServer}
        groups={groups}
        view={mobileView}
        onChannelSelect={handleChannelSelect}
      />

      <SidebarInset
        className={mobileView === "sidebars" ? "hidden md:flex" : "flex"}
      >
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background px-4 h-14">
          <div className="hidden md:block">
            <SidebarTrigger className="-ml-1" />
          </div>
          <button
            className="md:hidden p-1 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileView("sidebars")}
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

        {/* Page content (channel page, conversation page, etc.) */}
        {children}
      </SidebarInset>
    </>
  );
}
