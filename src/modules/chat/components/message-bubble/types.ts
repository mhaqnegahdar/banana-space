export type UserRole = "admin" | "moderator" | "user" | null

export type MessageType = "text" | "image" | "pdf"

export interface MessageUser {
  id: string
  name: string
  avatar: string
  role?: UserRole
}

export interface BaseMessage {
  id: string
  sender: "user" | "assistant"
  timestamp: Date
  user?: MessageUser
}

export interface TextMessage extends BaseMessage {
  type: "text"
  content: string
}

export interface ImageMessage extends BaseMessage {
  type: "image"
  imageUrl: string
  caption?: string
}

export interface PdfMessage extends BaseMessage {
  type: "pdf"
  fileName: string
  fileUrl: string
  fileSize?: string
}

export type Message = TextMessage | ImageMessage | PdfMessage
