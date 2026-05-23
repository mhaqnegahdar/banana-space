"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Server } from "@/modules/navigation/components/app-sidebar";
import { useModalStore } from "@/store/modal-store";

interface ServerIconListProps {
  servers: Server[];
  activeServer: Server;
  setActiveServer: (s: Server) => void;
  //TODO: Will open the create-server modal when wired up
}

// TODO: Client — needs onClick to switch active server
export function ServerIconList({
  servers,
  activeServer,
  setActiveServer,
}: ServerIconListProps) {
  const { open } = useModalStore();

  const onAddServer = () =>
    open({
      type: "createServer",
      title: "",
      description: "",
    });

  return (
    <SidebarMenu className="gap-2">
      {servers.map((server) => (
        <SidebarMenuItem key={server.id}>
          <SidebarMenuButton
            tooltip={{ children: server.name, hidden: false }}
            isActive={activeServer.id === server.id}
            onClick={() => setActiveServer(server)}
            className={cn(
              "size-8 rounded-lg transition-all duration-200 relative p-0! md:p-0!",
              activeServer.id === server.id ? "rounded-lg" : "hover:rounded-lg",
            )}
          >
            <Avatar>
              <AvatarImage
                src={server.image}
                alt={server.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
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
          onClick={onAddServer}
          className="size-8 transition-all duration-200"
        >
          <PlusIcon className="m-auto size-5 text-muted-foreground" />
          <span className="sr-only">Add a server</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
