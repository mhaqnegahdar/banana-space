import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import {
  getServerById,
  getServersByUserId,
  getMemberByUserAndServer,
} from "@/db/queries";
import { AppSidebar } from "@/modules/navigation/components/app-sidebar";
import { ServerLayoutClient } from "@/modules/navigation/components/server-layout-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarSkeleton } from "@/modules/navigation/components/app-sidebar-skeleton";
import type {
  Server,
  Channel,
  ChannelGroup,
} from "@/modules/navigation/components/app-sidebar";
import { requireAuth } from "@/lib/route-helpers";

// RSC layout — fetches all data, renders the sidebar shell,
// and passes data down to Client components as props.
// The page.tsx inside this layout gets `children` here.
export default async function ServerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const { serverId } = await params;

  const { profile, response } = await requireAuth();

  if (response) {
    redirect(`/login`);
  }

  // Run both fetches in parallel
  const [serverData, allServers] = await Promise.all([
    getServerById(serverId),
    getServersByUserId(profile.id),
  ]);

  if (!serverData) notFound();

  // Make sure this user is actually a member
  const membership = await getMemberByUserAndServer(profile.id, serverId);
  if (!membership) redirect("//");

  // ── Shape DB data into sidebar types ─────────────────────────────────────

  const activeServer: Server = {
    id: serverData.id,
    name: serverData.name,
    image: serverData.imageUrl,
    isActive: true,
  };

  const servers: Server[] = allServers.map((s) => ({
    id: s.id,
    name: s.name,
    image: s.imageUrl,
    isActive: s.id === serverId,
  }));

  const textChannels: ChannelGroup = {
    title: "Text Channels",
    channels: serverData.channels
      .filter((c) => c.type === "TEXT")
      .map((c) => ({ id: c.id, name: c.name, type: "text" as const })),
  };

  const voiceChannels: ChannelGroup = {
    title: "Voice Channels",
    channels: serverData.channels
      .filter((c) => c.type === "AUDIO")
      .map((c) => ({ id: c.id, name: c.name, type: "voice" as const })),
  };

  const videoChannels: ChannelGroup = {
    title: "Video Channels",
    channels: serverData.channels
      .filter((c) => c.type === "VIDEO")
      .map((c) => ({ id: c.id, name: c.name, type: "video" as const })),
  };

  const members: ChannelGroup = {
    title: "Members",
    channels: serverData.members.map((m) => ({
      id: m.id,
      name: m.user.name,
      type: "member" as const,
      avatar: m.user.image ?? undefined,
      status: "online" as const, // TODO: real presence comes from socket later
    })),
  };

  const groups: ChannelGroup[] = [
    textChannels,
    voiceChannels,
    videoChannels,
    members,
  ].filter((g) => g.channels.length > 0);

  const user = {
    name: profile.name,
    email: profile.email,
    avatar: profile.image ?? "",
  };

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "350px" } as React.CSSProperties}
    >
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebar
          servers={servers}
          activeServer={activeServer}
          groups={groups}
          user={user}
        />
      </Suspense>

      <ServerLayoutClient
        servers={servers}
        activeServer={activeServer}
        groups={groups}
      >
        {children}
      </ServerLayoutClient>
    </SidebarProvider>
  );
}
