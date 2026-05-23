"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ChannelIcon } from "@/modules/navigation/components/shared/channel-icon";
import { StatusDot } from "@/modules/navigation/components/shared/status-dot";
import type { Channel, ChannelGroup } from "@/modules/navigation/components/app-sidebar";

interface ChannelGroupsProps {
  groups: ChannelGroup[];
  activeChannelId: string;
  searchQuery: string;
  onChannelSelect: (channel: Channel) => void;
  // TODO: Will open create-channel modal when wired up
  onAddChannel?: (type: Channel["type"]) => void;
}

// Client — consumes activeChannelId and searchQuery from parent
export function ChannelGroups({
  groups,
  activeChannelId,
  searchQuery,
  onChannelSelect,
  onAddChannel,
}: ChannelGroupsProps) {
  const filterChannels = <T extends { name: string }>(items: T[]) =>
    searchQuery
      ? items.filter((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : items;

  return (
    <>
      {groups.map((group) => {
        const filtered = filterChannels(group.channels);
        if (filtered.length === 0) return null;

        return (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="flex items-center justify-between pr-1">
              <span>{group.title}</span>
              {group.title !== "Members" && (
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => onAddChannel?.(group.channels[0].type)}
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filtered.map((channel) => (
                  <SidebarMenuItem key={channel.id}>
                    <SidebarMenuButton
                      isActive={activeChannelId === channel.id}
                      onClick={() => onChannelSelect(channel)}
                      className="gap-1.5 px-1.5"
                    >
                      {channel.type === "member" ? (
                        <>
                          <div className="relative shrink-0">
                            <Avatar className="size-7">
                              <AvatarImage src={channel.avatar} />
                              <AvatarFallback className="text-[10px]">
                                {channel.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <StatusDot status={channel.status} />
                          </div>
                          <span className="truncate">{channel.name}</span>
                        </>
                      ) : (
                        <>
                          <ChannelIcon type={channel.type} />
                          <span>{channel.name}</span>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}