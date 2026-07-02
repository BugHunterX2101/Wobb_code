"use client";

import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Plus, Check, ExternalLink } from "lucide-react";
import { cn, formatFollowers } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/hooks/use-toast";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
  variant?: "default" | "compact";
}

function getPlatformColor(platform: Platform) {
  switch (platform) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "youtube":
      return "bg-red-500";
    case "tiktok":
      return "bg-black";
  }
}

function getPlatformIcon(platform: Platform) {
  switch (platform) {
    case "instagram":
      return "📷";
    case "youtube":
      return "▶️";
    case "tiktok":
      return "🎵";
  }
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
  variant = "default",
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { addProfile, removeProfile, isProfileSaved } = useAppStore();
  const isSaved = isProfileSaved(profile.user_id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeProfile(profile.user_id);
      toast({
        title: "Removed",
        description: `${profile.username} removed from your list`,
        variant: "destructive",
      });
    } else {
      const added = addProfile(profile, platform);
      if (added) {
        toast({
          title: "Added to List",
          description: `${profile.username} has been added to your saved profiles`,
          variant: "success",
        });
      } else {
        toast({
          title: "Already in List",
          description: `${profile.username} is already in your saved profiles`,
        });
      }
    }
  };

  if (variant === "compact") {
    return (
      <div
        onClick={handleClick}
        className="group flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.picture} alt={profile.username} />
          <AvatarFallback className="text-xs font-medium">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium truncate">@{profile.username}</span>
            {profile.is_verified && <Badge variant="verified" className="flex-shrink-0">✓ Verified</Badge>}
          </div>
          <p className="text-sm text-gray-500 truncate">{profile.fullname}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{formatFollowers(profile.followers)}</span>
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="icon"
            onClick={handleAddToList}
            aria-label={isSaved ? "Remove from list" : "Add to list"}
          >
            {isSaved ? <Check className="h-4 w-4 text-green-600" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
      data-search={searchQuery}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.picture} alt={profile.username} />
          <AvatarFallback className="text-xl font-medium bg-gradient-to-br from-gray-200 to-gray-300">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {profile.is_verified && (
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs shadow-lg">
            ✓
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 truncate">@{profile.username}</h3>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
              getPlatformColor(platform)
            )}
          >
            <span>{getPlatformIcon(platform)}</span>
            <span className="text-white capitalize">{platform}</span>
          </span>
        </div>
        <p className="mt-1 text-gray-600 truncate">{profile.fullname}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{formatFollowers(profile.followers)}</span>
          {profile.engagement_rate && (
            <span>ER: {(profile.engagement_rate * 100).toFixed(2)}%</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isSaved ? "secondary" : "outline"}
          onClick={handleAddToList}
          className="gap-2"
          aria-label={isSaved ? "Remove from list" : "Add to list"}
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add to List</span>
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(profile.url, "_blank", "noopener,noreferrer");
          }}
          aria-label="View profile on platform"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}