import { Camera, Play, Disc3 } from "lucide-react";
import type { Platform } from "@/types";

export function getPlatformIcon(platform: Platform, size = 16) {
  switch (platform) {
    case "instagram":
      return <Camera size={size} className="text-pink-400" />;
    case "youtube":
      return <Play size={size} className="text-red-400" />;
    case "tiktok":
      return <Disc3 size={size} className="text-cyan-400" />;
  }
}

export function getPlatformIconWhite(platform: Platform, size = 16) {
  switch (platform) {
    case "instagram":
      return <Camera size={size} />;
    case "youtube":
      return <Play size={size} />;
    case "tiktok":
      return <Disc3 size={size} />;
  }
}
