"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Plus, Check, ExternalLink, TrendingUp, Users } from "lucide-react";
import { formatFollowers } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/hooks/use-toast";
import { getPlatformIconWhite } from "./PlatformIcons";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
  variant?: "default" | "compact";
  index?: number;
}

const platformAccents: Record<Platform, string> = {
  instagram: "border-pink-500/30 hover:border-pink-500/50",
  youtube: "border-red-500/30 hover:border-red-500/50",
  tiktok: "border-cyan-500/30 hover:border-cyan-500/50",
};

const platformBadgeColors: Record<Platform, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  youtube: "bg-red-500",
  tiktok: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
};

const platformShadowColors: Record<Platform, string> = {
  instagram: "rgba(236, 72, 153, 0.15)",
  youtube: "rgba(255, 0, 0, 0.15)",
  tiktok: "rgba(6, 182, 212, 0.15)",
};

function getPlatformIcon(platform: Platform) {
  return getPlatformIconWhite(platform, 12);
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
  variant = "default",
  index = 0,
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
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        onClick={handleClick}
        className="group flex items-center gap-3 p-3 rounded-xl border border-purple-500/20 hover:bg-white/10 cursor-pointer transition-all"
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
          <AvatarImage src={profile.picture} alt={profile.username} />
          <AvatarFallback className="text-xs font-bold bg-purple-500/30 text-white">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold truncate text-white">@{profile.username}</span>
            {profile.is_verified && <Badge variant="verified" className="flex-shrink-0">✓ Verified</Badge>}
          </div>
          <p className="text-sm text-gray-400 truncate">{profile.fullname}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 font-medium">{formatFollowers(profile.followers)}</span>
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="icon"
            onClick={handleAddToList}
            aria-label={isSaved ? "Remove from list" : "Add to list"}
          >
            {isSaved ? <Check className="h-4 w-4 text-green-400" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={handleClick}
      className={`group relative flex items-center gap-4 p-4 rounded-xl border bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 cursor-pointer ${platformAccents[platform]}`}
      data-search={searchQuery}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 40px ${platformShadowColors[platform]}`,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex-shrink-0">
        <Avatar className="h-16 w-16 ring-2 ring-purple-500/20">
          <AvatarImage src={profile.picture} alt={profile.username} />
          <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {profile.is_verified && (
          <motion.span
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs shadow-lg shadow-blue-500/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          >
            ✓
          </motion.span>
        )}
      </div>

      <div className="relative flex-1 min-w-0 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-white truncate font-sans">@{profile.username}</h3>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${platformBadgeColors[platform]}`}
          >
            <span>{getPlatformIcon(platform)}</span>
            <span className="text-white capitalize">{platform}</span>
          </span>
        </div>
        <p className="mt-1 text-gray-300 truncate font-body">{profile.fullname}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400 font-body">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-semibold text-purple-300">{formatFollowers(profile.followers)}</span>
          </span>
          {profile.engagement_rate && (
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-pink-400" />
              <span>ER: {(profile.engagement_rate * 100).toFixed(2)}%</span>
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-2 z-10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isSaved ? "secondary" : "outline"}
            onClick={handleAddToList}
            className="gap-2 font-body"
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
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
        </motion.div>
      </div>
    </motion.div>
  );
}
