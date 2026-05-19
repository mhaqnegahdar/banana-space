"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "./types"

interface UserBadgeProps {
  role: UserRole
  className?: string
}

export function UserBadge({ role, className }: UserBadgeProps) {
  if (!role || role === "user") return null

  const badgeConfig = {
    admin: {
      label: "Admin",
      className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
    },
    moderator: {
      label: "Mod",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
    },
  }

  const config = badgeConfig[role]
  if (!config) return null

  return (
    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4", config.className, className)}>
      {config.label}
    </Badge>
  )
}
