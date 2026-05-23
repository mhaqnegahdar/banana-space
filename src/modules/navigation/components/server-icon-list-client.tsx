"use client";

import { useState } from "react";
import { ServerIconList } from "./server-icon-list";
import type { Server } from "./app-sidebar";

// Thin client wrapper — holds activeServer state, passes down to ServerIconList.
// Separated from the RSC AppSidebar so the RSC never needs "use client".
export function ServerIconListClient({
  servers,
  initialActiveServer,
}: {
  servers: Server[];
  initialActiveServer: Server;
}) {
  const [activeServer, setActiveServer] = useState(initialActiveServer);

  return (
    <ServerIconList
      servers={servers}
      activeServer={activeServer}
      setActiveServer={setActiveServer}
    />
  );
}