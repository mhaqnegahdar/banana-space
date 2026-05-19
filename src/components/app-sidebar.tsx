"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusIcon,
  HashIcon,
  MicIcon,
  VideoIcon,
  UserPlusIcon,
  LogOutIcon,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BananaSlice from "./layout/icons/banana-slice";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Server = {
  id: string;
  name: string;
  image: string;
  isActive?: boolean;
};

export type ChannelType = "text" | "voice" | "video" | "member";

export type Channel = {
  id: string;
  name: string;
  type: ChannelType;
  avatar?: string;
  status?: "online" | "offline" | "away";
};

export type ChannelGroup = {
  title: string;
  channels: Channel[];
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const mockServers: Server[] = [
  {
    id: "1",
    name: "Code With Antonio",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=antonio",
    isActive: true,
  },
  {
    id: "2",
    name: "Design Hub",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=design",
    isActive: false,
  },
  {
    id: "3",
    name: "Gaming Lounge",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=gaming",
    isActive: false,
  },
];

export const mockChannelGroups: ChannelGroup[] = [
  {
    title: "Text Channels",
    channels: [
      { id: "1", name: "general", type: "text" },
      { id: "2", name: "announcements", type: "text" },
      { id: "3", name: "off-topic", type: "text" },
    ],
  },
  {
    title: "Voice Channels",
    channels: [
      { id: "4", name: "voice channel", type: "voice" },
      { id: "5", name: "music", type: "voice" },
    ],
  },
  {
    title: "Video Channels",
    channels: [
      { id: "6", name: "daily", type: "video" },
      { id: "7", name: "presentations", type: "video" },
    ],
  },
  {
    title: "Members",
    channels: [
      {
        id: "8",
        name: "Antonio Erdeljac",
        type: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=antonio",
        status: "online",
      },
      {
        id: "9",
        name: "Jane Doe",
        type: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        status: "away",
      },
      {
        id: "10",
        name: "John Smith",
        type: "member",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        status: "offline",
      },
    ],
  },
];

const mockUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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
        "size-2  shrink-0 absolute -bottom-0.5 -right-0.5 ring-1 ring-background",
        status === "online" && "bg-green-500",
        status === "away" && "bg-yellow-500",
        status === "offline" && "bg-muted-foreground/40",
      )}
    />
  );
}

// ─── Channel List (shared between desktop sidebar col2 and mobile) ────────────

export function ChannelList({
  activeServer,
  activeChannelId,
  setActiveChannelId,
  searchQuery,
  setSearchQuery,
  searchRef,
  onChannelSelect,
}: {
  activeServer: Server;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchRef?: React.RefObject<HTMLInputElement>;
  onChannelSelect?: (channel: Channel) => void;
}) {
  const filterChannels = <T extends { name: string }>(items: T[]) =>
    searchQuery
      ? items.filter((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : items;

  return (
    <>
      <SidebarHeader className="border-b p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full px-4 py-3 rounded-none data-[state=open]:bg-sidebar-accent"
                >
                  <span className="font-semibold text-sm truncate flex-1 text-left">
                    {activeServer.name}
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground ml-auto" />
                </SidebarMenuButton>
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
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 pb-2">
          <SidebarInput
            ref={searchRef}
            placeholder="Search channels (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {mockChannelGroups.map((group) => {
          const filtered = filterChannels(group.channels);
          if (filtered.length === 0) return null;
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="flex items-center justify-between pr-1">
                <span>{group.title}</span>
                {group.title !== "Members" && (
               
                    <PlusIcon className="size-3.5" />
                )}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filtered.map((channel) => (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton
                        isActive={activeChannelId === channel.id}
                        onClick={() => {
                          setActiveChannelId(channel.id);
                          onChannelSelect?.(channel);
                        }}
                        className="gap-1.5"
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
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </>
  );
}

// ─── Server Icon List (shared between desktop col1 and mobile) ────────────────

export function ServerIconList({
  activeServer,
  setActiveServer,
}: {
  activeServer: Server;
  setActiveServer: (s: Server) => void;
}) {
  return (
    <SidebarMenu className="gap-2">
      {mockServers.map((server) => (
        <SidebarMenuItem key={server.id}>
          <SidebarMenuButton
            tooltip={{ children: server.name, hidden: false }}
            isActive={activeServer.id === server.id}
            onClick={() => setActiveServer(server)}
            className={cn(
              " size-8 rounded-lg  xl:rounded-lg transition-all duration-200 relative",
              activeServer.id === server.id ? "rounded-lg" : "hover:rounded-lg",
            )}
          >
            
            <Avatar className=" ">
              <AvatarImage
                src={server.image}
                alt={server.name}
                className="object-cover"
              />
              <AvatarFallback className=" text-xs font-semibold">
                {server.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">{server.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={{ children: "Add a server", hidden: false }}
          className="px-1.5 md:px-1 size-8  transition-all duration-200"
        >
          <PlusIcon className="size-5 text-muted-foreground" />
          <span className="sr-only">Add a server</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ─── Main AppSidebar (desktop only — hidden on mobile) ────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeServer, setActiveServer] = React.useState(mockServers[0]);
  const [activeChannelId, setActiveChannelId] = React.useState(
    mockChannelGroups[0].channels[0].id,
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

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

  return (
    // Hide entirely on mobile — MobileSidebarNav handles mobile
    <div className="hidden md:contents">
      <Sidebar
        collapsible="icon"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        {...props}
      >
        {/* Column 1: Server list */}
        <Sidebar
          collapsible="none"
          className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="mb-2">
                  <BananaSlice />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <ServerIconList
                  activeServer={activeServer}
                  setActiveServer={setActiveServer}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={mockUser} />
          </SidebarFooter>
        </Sidebar>

        {/* Column 2: Channels */}
        <Sidebar collapsible="none" className="flex-1">
          <ChannelList
            activeServer={activeServer}
            activeChannelId={activeChannelId}
            setActiveChannelId={setActiveChannelId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchRef={searchRef}
          />
        </Sidebar>
      </Sidebar>
    </div>
  );
}
