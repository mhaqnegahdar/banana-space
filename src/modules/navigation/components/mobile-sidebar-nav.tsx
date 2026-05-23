"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from "lucide-react";
import BananaSlice from "@/components/layout/icons/banana-slice";
import { ServerDropdown } from "./shared/server-dropdown";
import { ChannelGroups } from "./channel-groups";
import type { Server, Channel, ChannelGroup } from "./app-sidebar";

type MobileView = "sidebars" | "chat";

interface MobileSidebarNavProps {
  servers: Server[];
  initialActiveServer: Server;
  groups: ChannelGroup[];
  view: MobileView;
  onChannelSelect: (channel: Channel) => void;
}

export function MobileSidebarNav({
  servers,
  initialActiveServer,
  groups,
  view,
  onChannelSelect,
}: MobileSidebarNavProps) {
  const [activeServer, setActiveServer] = useState(initialActiveServer);
  const [activeChannelId, setActiveChannelId] = useState(
    groups[0]?.channels[0]?.id ?? "",
  );
  const [searchQuery, setSearchQuery] = useState("");

  function handleChannelSelect(channel: Channel) {
    setActiveChannelId(channel.id);
    onChannelSelect(channel);
  }

  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-40 flex bg-background transition-transform duration-300",
        view === "sidebars" ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Column 1: Server icons */}
      <div className="flex flex-col items-center w-16 border-r bg-sidebar py-3 gap-2 shrink-0">
        <div className="mb-2">
          <BananaSlice />
        </div>

        <div className="flex flex-col gap-2 flex-1 items-center">
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server)}
              className={cn(
                "relative size-10 rounded-2xl transition-all duration-200 overflow-hidden",
                activeServer.id === server.id
                  ? "rounded-xl ring-2 ring-primary"
                  : "hover:rounded-xl",
              )}
            >
              <Avatar className="size-10 rounded-[inherit]">
                <AvatarImage src={server.image} alt={server.name} />
                <AvatarFallback className="rounded-[inherit] text-xs font-semibold">
                  {server.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          ))}

          <button className="size-10 rounded-full flex items-center justify-center hover:rounded-xl transition-all duration-200">
            <PlusIcon className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Column 2: Channels */}
      <div className="flex flex-col flex-1 overflow-hidden bg-sidebar">
        <div className="border-b">
          <ServerDropdown activeServer={activeServer} />
          <div className="px-2 pb-2">
            <input
              placeholder="Search channels (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* 
            Reusing ChannelGroups here. It uses SidebarMenu internally
            which is fine — SidebarProvider wraps the whole page.
          */}
          <ChannelGroups
            groups={groups}
            activeChannelId={activeChannelId}
            searchQuery={searchQuery}
            onChannelSelect={handleChannelSelect}
          />
        </div>
      </div>
    </div>
  );
}
