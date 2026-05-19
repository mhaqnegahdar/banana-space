"use client"

import { TextBubble } from "./text-bubble"
import { ImageBubble } from "./image-bubble"
import { PdfBubble } from "./pdf-bubble"
import type { Message } from "./types"

interface MessageBubbleProps {
  message: Message
  formatTime: (date: Date) => string
}

export function MessageBubble({ message, formatTime }: MessageBubbleProps) {
  switch (message.type) {
    case "image":
      return <ImageBubble message={message} formatTime={formatTime} />
    case "pdf":
      return <PdfBubble message={message} formatTime={formatTime} />
    case "text":
    default:
      return <TextBubble message={message} formatTime={formatTime} />
  }
}

export { TextBubble, ImageBubble, PdfBubble }
export type { Message, TextMessage, ImageMessage, PdfMessage, MessageUser, UserRole } from "./types"
