import { HashIcon, MicIcon, VideoIcon } from "lucide-react";
import type { ChannelType } from "@/modules/navigation/components/app-sidebar";

export function ChannelIcon({ type }: { type: ChannelType }) {
  if (type === "text") return <HashIcon className="size-3.5 shrink-0" />;
  if (type === "voice") return <MicIcon className="size-3.5 shrink-0" />;
  if (type === "video") return <VideoIcon className="size-3.5 shrink-0" />;
  return null;
}
