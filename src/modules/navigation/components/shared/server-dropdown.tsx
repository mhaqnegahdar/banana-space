"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDown,
  UserPlusIcon,
  PlusIcon,
  LogOutIcon,
} from "lucide-react";
import type { Server } from "@/modules/navigation/components/app-sidebar";

interface ServerDropdownProps {
  activeServer: Server;
  //TODO: These will eventually call our route handlers
  onInvite?: () => void;
  onCreateChannel?: () => void;
  onLeave?: () => void;
}

// Client — dropdown open/close state is internal to Radix
export function ServerDropdown({
  activeServer,
  onInvite,
  onCreateChannel,
  onLeave,
}: ServerDropdownProps) {
  return (
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
        <DropdownMenuItem className="cursor-pointer" onClick={onInvite}>
          Invite People
          <UserPlusIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onCreateChannel}>
          Create Channel
          <PlusIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={onLeave}
        >
          Leave Server
          <LogOutIcon className="size-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
