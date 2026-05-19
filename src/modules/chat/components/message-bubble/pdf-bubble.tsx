"use client"

import { FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageAvatar } from "./message-avatar"
import { UserBadge } from "./user-badge"
import type { PdfMessage } from "./types"

interface PdfBubbleProps {
  message: PdfMessage
  formatTime: (date: Date) => string
}

export function PdfBubble({ message, formatTime }: PdfBubbleProps) {
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

        {/* PDF bubble */}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              isUser ? "bg-primary-foreground/20" : "bg-background"
            )}>
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              {message.fileSize && (
                <p className={cn(
                  "text-xs",
                  isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {message.fileSize}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 shrink-0",
                isUser 
                  ? "text-primary-foreground hover:bg-primary-foreground/20" 
                  : "text-foreground hover:bg-background"
              )}
              asChild
            >
              <a href={message.fileUrl} download={message.fileName}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
