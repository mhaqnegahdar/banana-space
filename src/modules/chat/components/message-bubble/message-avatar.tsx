"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { MessageUser } from "./types"

interface MessageAvatarProps {
  user?: MessageUser
  isAssistant?: boolean
  className?: string
}

export function MessageAvatar({ user, isAssistant, className }: MessageAvatarProps) {
  if (isAssistant) {
    return (
      <Avatar className={cn("h-9 w-9 rounded-lg", className)}>
        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
          AI
        </AvatarFallback>
      </Avatar>
    )
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <Avatar className={cn("h-9 w-9 rounded-lg", className)}>
      <AvatarImage src={user?.avatar} alt={user?.name || "User"} className="rounded-lg object-cover" />
      <AvatarFallback className="rounded-lg bg-muted text-muted-foreground font-semibold text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
