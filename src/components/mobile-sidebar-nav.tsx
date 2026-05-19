"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HashIcon,
  MicIcon,
  VideoIcon,
  PlusIcon,
  UserPlusIcon,
  LogOutIcon,
  ChevronsUpDown,
} from "lucide-react";
import BananaSlice from "@/components/layout/icons/banana-slice";
import {
  mockServers,
  mockChannelGroups,
  type Server,
  type Channel,
  type ChannelType,
} from "@/components/app-sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileView = "sidebars" | "chat";

interface MobileSidebarNavProps {
  view: MobileView;
  onChannelSelect: (channel: Channel) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ChannelIcon({ type }: { type: ChannelType }) {
  if (type === "text") return <HashIcon className="size-3.5 shrink-0" />;
  if (type === "voice") return <MicIcon className="size-3.5 shrink-0" />;
  if (type === "video") return <VideoIcon className="size-3.5 shrink-0" />;
  return null;
}

function StatusDot({ status }: { status?: Channel["status"] }) {
  return (
    <span
      className={cn(
        "size-2 rounded-full shrink-0 absolute -bottom-0.5 -right-0.5 ring-1 ring-background",
        status === "online" && "bg-green-500",
        status === "away" && "bg-yellow-500",
        status === "offline" && "bg-muted-foreground/40",
      )}
    />
  );
}

// ─── Mobile Sidebar Nav ───────────────────────────────────────────────────────

export function MobileSidebarNav({
  view,
  onChannelSelect,
}: MobileSidebarNavProps) {
  const [activeServer, setActiveServer] = React.useState<Server>(
    mockServers[0],
  );
  const [activeChannelId, setActiveChannelId] = React.useState(
    mockChannelGroups[0].channels[0].id,
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const filterChannels = <T extends { name: string }>(items: T[]) =>
    searchQuery
      ? items.filter((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : items;

  // Only render on mobile, and only when view === "sidebars"
  return (
    <div
      className={cn(
        "md:hidden fixed inset-0 z-40 flex bg-background transition-transform duration-300",
        view === "sidebars" ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* ── Column 1: Server icons (narrow, ~64px) ── */}
      <div className="flex flex-col items-center w-16 border-r bg-sidebar py-3 gap-2 shrink-0">
        {/* Logo */}
        <div className="mb-2">
          <BananaSlice />
        </div>

        {/* Server icons */}
        <div className="flex flex-col gap-2 flex-1 items-center">
          {mockServers.map((server) => (
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
              {activeServer.id === server.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-1 rounded-r-full bg-foreground z-10" />
              )}
              <Avatar className="size-10 rounded-[inherit]">
                <AvatarImage src={server.image} alt={server.name} />
                <AvatarFallback className="rounded-[inherit] text-xs font-semibold">
                  {server.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          ))}

          {/* Add server */}
          <button className="size-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:rounded-xl transition-all duration-200">
            <PlusIcon className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ── Column 2: Channel list (fills remaining width) ── */}
      <div className="flex flex-col flex-1 overflow-hidden bg-sidebar">
        {/* Server name header */}
        <div className="border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center px-4 py-3 hover:bg-sidebar-accent transition-colors">
                <span className="font-semibold text-sm truncate flex-1 text-left">
                  {activeServer.name}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <UserPlusIcon className="size-4 mr-2" />
                Invite People
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <PlusIcon className="size-4 mr-2" />
                Create Channel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOutIcon className="size-4 mr-2" />
                Leave Server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="px-2 pb-2">
            <input
              placeholder="Search channels (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Channel groups — scrollable */}
        <div className="flex-1 overflow-y-auto py-2">
          {mockChannelGroups.map((group) => {
            const filtered = filterChannels(group.channels);
            if (filtered.length === 0) return null;
            return (
              <div key={group.title} className="mb-2">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                    {group.title}
                  </span>
                  {group.title !== "Members" && (
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <PlusIcon className="size-3.5" />
                    </button>
                  )}
                </div>
                <div className="space-y-0.5 px-2">
                  {filtered.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannelId(channel.id);
                        onChannelSelect(channel);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                        activeChannelId === channel.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                      )}
                    >
                      {channel.type === "member" ? (
                        <>
                          <div className="relative shrink-0">
                            <Avatar className="size-5">
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
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
