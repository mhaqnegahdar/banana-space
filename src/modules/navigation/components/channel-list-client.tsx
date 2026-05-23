"use client";

import { useState } from "react";
import { ChannelList } from "./channel-list";
import type { Server, ChannelGroup } from "./app-sidebar";

// Thin client wrapper — holds activeServer + activeChannelId state.
// When the user switches server in ServerIconListClient, you'll lift this
// state up to a shared context or Zustand store. For now it's self-contained.
export function ChannelListClient({
  initialActiveServer,
  groups,
}: {
  servers: Server[];
  initialActiveServer: Server;
  groups: ChannelGroup[];
}) {
  const [activeServer, setActiveServer] = useState(initialActiveServer);
  const [activeChannelId, setActiveChannelId] = useState(
    groups[0]?.channels[0]?.id ?? "",
  );

  return (
    <ChannelList
      activeServer={activeServer}
      groups={groups}
      activeChannelId={activeChannelId}
      setActiveChannelId={setActiveChannelId}
    />
  );
}
