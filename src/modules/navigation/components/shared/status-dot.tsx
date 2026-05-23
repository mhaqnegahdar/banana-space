import { cn } from "@/lib/utils";
import type { Channel } from "@/modules/navigation/components/app-sidebar";

export function StatusDot({ status }: { status?: Channel["status"] }) {
  return (
    <span
      className={cn(
        "size-2 rounded-full shrink-0 absolute -bottom-0.5 -right-0.5 ring-1 ring-background",
        status === "online" && "bg-green-500",
        status === "away" && "bg-yellow-500",
        status === "offline" && "bg-muted-foreground/40",
      )}
    />
  );
}
