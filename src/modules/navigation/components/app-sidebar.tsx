import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { ServerIconListClient } from "@/modules/navigation/components/server-icon-list-client";
import { ChannelListClient } from "./channel-list-client";
import BananaSlice from "@/components/layout/icons/banana-slice";

// ─── Types (exported so other files import from here) ─────────────────────────

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

export type NavUserData = {
  name: string;
  email: string;
  avatar: string;
};

// ─── Props — data comes from the RSC layout, not fetched here ─────────────────

interface AppSidebarProps {
  servers: Server[];
  activeServer: Server;
  groups: ChannelGroup[];
  user: NavUserData;
}

// RSC — no "use client", no hooks, no state.
// All interactivity is pushed into the Client leaf components below.
export function AppSidebar({
  servers,
  activeServer,
  groups,
  user,
}: AppSidebarProps) {
  return (
    <div className="hidden md:contents">
      <Sidebar
        collapsible="icon"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
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
                {/*
                  ServerIconListClient is "use client" because it manages
                  which server is active. It receives the server list from
                  this RSC so the data never fetches on the client.
                */}
                <ServerIconListClient
                  servers={servers}
                  initialActiveServer={activeServer}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
        </Sidebar>

        {/* Column 2: Channels */}
        <Sidebar collapsible="none" className="flex-1">
          {/*
            ChannelListClient is "use client" — owns search state and
            active channel state. Receives groups from RSC as props.
          */}
          <ChannelListClient
            initialActiveServer={activeServer}
            servers={servers}
            groups={groups}
          />
        </Sidebar>
      </Sidebar>
    </div>
  );
}
