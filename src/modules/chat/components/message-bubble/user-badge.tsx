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
      className: "bg-[#008879]/10 text-[#008879] border-[#008879]/20 hover:bg-[#008879]/20",
    },
    moderator: {
      label: "Mod",
      className: "bg-[#939e00]/10 text-[#939e00] border-[#939e00]/20 hover:bg-[#939e00]/20",
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
