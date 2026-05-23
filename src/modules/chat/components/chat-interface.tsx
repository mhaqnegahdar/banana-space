"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Mic, ImageIcon, Hash } from "lucide-react";
import {
  MessageBubble,
  type Message,
  type MessageUser,
} from "@/modules/chat/components/message-bubble";
import { TypingIndicator } from "@/modules/chat/components/message-bubble/typing-indicator";

const users = [
  {
    id: "1",
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    unread: 3,
    lastMessage: "Hey, how's it going?",
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    unread: 0,
    lastMessage: "Can we discuss the project?",
  },
  {
    id: "3",
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    unread: 0,
    lastMessage: "Thanks for your help!",
  },
  {
    id: "4",
    name: "Liam Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    unread: 1,
    lastMessage: "I'll send you the files later",
  },
  {
    id: "5",
    name: "Olivia Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    unread: 0,
    lastMessage: "Let's meet tomorrow",
  },
];

const currentUser: MessageUser = {
  id: "current",
  name: "You",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "admin",
};

type ChatInterfaceProps = {
  selectedUser?: string | null;
  channelName?: string;
};

// ─── Welcome Screen ───────────────────────────────────────────────────────────

function ChannelWelcome({ channelName }: { channelName: string }) {
  return (
    <div className="flex flex-col items-start px-4 pt-8 pb-4">
      {/* Large hash icon */}
      <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4">
        <Hash className="size-9 text-muted-foreground" strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-bold mb-1">Welcome to #{channelName}</h1>
      <p className="text-muted-foreground text-sm">
        This is the start of the #{channelName} channel.
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatInterface({
  selectedUser,
  channelName = "general",
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "text",
      content: "Hello! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(
        "Sat May 23 2026 16:14:11 GMT+0330 (Iran Standard Time)",
      ),
    },
    {
      id: "2",
      type: "text",
      content: "I need help with my project. Can you take a look at this?",
      sender: "user",
      timestamp: new Date(
        "Sat May 23 2026 16:14:11 GMT+0330 (Iran Standard Time)",
      ),
      user: currentUser,
    },
    {
      id: "3",
      type: "image",
      imageUrl: "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Caleb",
      caption: "Here is the design mockup",
      sender: "user",
      timestamp: new Date(
        "Sat May 23 2026 16:14:11 GMT+0330 (Iran Standard Time)",
      ),
      user: currentUser,
    },
    {
      id: "4",
      type: "text",
      content:
        "That looks great! I can see you've made good progress on the UI design.",
      sender: "assistant",
      timestamp: new Date(
        "Sat May 23 2026 16:14:11 GMT+0330 (Iran Standard Time)",
      ),
    },
    {
      id: "5",
      type: "pdf",
      fileName: "project-requirements.pdf",
      fileUrl: "#",
      fileSize: "2.4 MB",
      sender: "user",
      timestamp: new Date(
        "Sat May 23 2026 16:14:11 GMT+0330 (Iran Standard Time)",
      ),
      user: { ...currentUser, role: "moderator" },
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedUserData = selectedUser
    ? users.find((user) => user.id === selectedUser)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      user: currentUser,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: `I received your message: "${inputValue}"`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Discord-style channel welcome at top */}
          <ChannelWelcome channelName={channelName} />

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              formatTime={formatTime}
            />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message #${channelName}`}
              className="pr-10 rounded-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="rounded-full"
            disabled={inputValue.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
