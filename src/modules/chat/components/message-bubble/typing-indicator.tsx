"use client"

import { MessageAvatar } from "./message-avatar"

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <MessageAvatar isAssistant className="mt-1 shrink-0" />
      
      <div className="flex flex-col gap-1 items-start">
        <span className="text-sm font-medium text-foreground">AI Assistant</span>
        
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex space-x-1.5">
            <div
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
