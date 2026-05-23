"use client";

import React from "react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ServerDropdown } from "@/modules/navigation/components/shared/server-dropdown";
import { ChannelGroups } from "@/modules/navigation/components/channel-groups";
import type { Server, Channel, ChannelGroup } from "@/modules/navigation/components/app-sidebar";

interface ChannelListProps {
  activeServer: Server;
  groups: ChannelGroup[];
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  onChannelSelect?: (channel: Channel) => void;
}

// Client — owns search state, delegates rendering to ChannelGroups
export function ChannelList({
  activeServer,
  groups,
  activeChannelId,
  setActiveChannelId,
  onChannelSelect,
}: ChannelListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function handleChannelSelect(channel: Channel) {
    setActiveChannelId(channel.id);
    onChannelSelect?.(channel);
  }

  return (
    <>
      <SidebarHeader className="border-b p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <ServerDropdown activeServer={activeServer} />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 pb-2">
          <SidebarInput
            ref={searchRef as React.RefObject<HTMLInputElement>}
            placeholder="Search channels (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ChannelGroups
          groups={groups}
          activeChannelId={activeChannelId}
          searchQuery={searchQuery}
          onChannelSelect={handleChannelSelect}
        />
      </SidebarContent>
    </>
  );
}
