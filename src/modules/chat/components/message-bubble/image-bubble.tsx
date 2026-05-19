"use client"

import { cn } from "@/lib/utils"
import { MessageAvatar } from "./message-avatar"
import { UserBadge } from "./user-badge"
import type { ImageMessage } from "./types"

interface ImageBubbleProps {
  message: ImageMessage
  formatTime: (date: Date) => string
}

export function ImageBubble({ message, formatTime }: ImageBubbleProps) {
  const isUser = message.sender === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <MessageAvatar user={message.user} isAssistant={!isUser} className="mt-1 shrink-0" />
      
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        {/* User info header */}
        <div className={cn("flex items-center gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
          <span className="text-sm font-medium text-foreground">
            {isUser ? message.user?.name || "You" : "AI Assistant"}
          </span>
          {message.user?.role && <UserBadge role={message.user.role} />}
        </div>

        {/* Image bubble */}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl overflow-hidden",
            isUser
              ? "bg-primary/5 rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <img
            src={message.imageUrl}
            alt={message.caption || "Shared image"}
            className="max-w-full max-h-64 object-contain"
          />
          {message.caption && (
            <div className={cn(
              "px-4 py-2",
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <p className="text-sm leading-relaxed">{message.caption}</p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
