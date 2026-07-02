"use client";

import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatFollowers, formatEngagementRate } from "@/lib/utils";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useAppStore } from "@/store/useAppStore";
import { Plus, Check, ExternalLink, ArrowLeft, Users, TrendingUp, Eye, Heart, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getPlatformIconWhite } from "@/components/PlatformIcons";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";

function getPlatformColor(platform: Platform) {
  switch (platform) {
    case "instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    case "youtube":
      return "bg-red-500";
    case "tiktok":
      return "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400";
  }
}

const platformGradients: Record<Platform, string> = {
  instagram: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
  youtube: "from-red-500/20 via-orange-500/20 to-red-500/20",
  tiktok: "from-cyan-500/20 via-purple-500/20 to-pink-500/20",
};

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const backRoute = platform === "instagram" ? "/" : `/${platform}`;

  const { addProfile, removeProfile, isProfileSaved } = useAppStore();
  const isSaved = username ? isProfileSaved(username) : false;

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  const handleAddToList = () => {
    if (!profileData || !username) return;

    const user = profileData.data.user_profile;
    if (isSaved) {
      removeProfile(user.user_id);
      toast({
        title: "Removed from List",
        description: `@${user.username} has been removed from your saved profiles`,
        variant: "destructive",
      });
    } else {
      const added = addProfile(user, platform);
      if (added) {
        toast({
          title: "Added to List",
          description: `@${user.username} has been added to your saved profiles`,
          variant: "success",
        });
      } else {
        toast({
          title: "Already in List",
          description: `@${user.username} is already in your saved profiles`,
        });
      }
    }
  };

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-400">Invalid profile</p>
          <Link to={backRoute} className="text-purple-400 hover:text-purple-300 hover:underline mt-4 inline-block">
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Could not load profile details for @{username}</p>
          <Link to={backRoute} className="text-purple-400 hover:text-purple-300 hover:underline">
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout title={user.fullname} showSavedProfiles={true}>
      <div className="max-w-4xl mx-auto">
        <Link
          to={backRoute}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors font-body"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        <div className={`rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-500/10`}>
          <div className={`bg-gradient-to-r p-8 ${platformGradients[platform]}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-4xl mx-auto">
              <div className="relative flex-shrink-0">
                <Avatar className="h-28 w-28 ring-4 ring-purple-500/30 shadow-xl shadow-purple-500/20">
                  <AvatarImage src={user.picture} alt={user.fullname} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.is_verified && (
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm shadow-lg shadow-blue-500/30">
                    ✓
                  </span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-sans">@{user.username}</h2>
                  {user.is_verified && (
                    <Badge variant="verified" className="flex items-center gap-1">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-300 text-lg font-body">{user.fullname}</p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white",
                      getPlatformColor(platform)
                    )}
                  >
                    <span>{getPlatformIconWhite(platform, 14)}</span>
                    <span className="capitalize">{platform}</span>
                  </span>
                  {user.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 hover:bg-white/10 font-body"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(user.url, "_blank", "noopener,noreferrer");
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {user.description && (
              <motion.div
                className="mb-8 p-6 bg-white/5 rounded-xl border border-purple-500/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-2 font-sans">Bio</h3>
                <p className="text-gray-300 leading-relaxed font-body">{user.description}</p>
              </motion.div>
            )}

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              <StatCard
                label="Followers"
                value={formatFollowers(user.followers)}
                icon={<Users className="h-5 w-5 text-purple-400" />}
              />
              {user.engagement_rate !== undefined && (
                <StatCard
                  label="Engagement Rate"
                  value={formatEngagementRate(user.engagement_rate)}
                  icon={<TrendingUp className="h-5 w-5 text-pink-400" />}
                />
              )}
              {user.posts_count !== undefined && (
                <StatCard
                  label="Posts"
                  value={formatNumber(user.posts_count)}
                  icon={<FileText className="h-5 w-5 text-blue-400" />}
                />
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <StatCard
                  label="Avg Views"
                  value={formatFollowers(user.avg_views)}
                  icon={<Eye className="h-5 w-5 text-cyan-400" />}
                />
              )}
              {user.avg_likes !== undefined && (
                <StatCard
                  label="Avg Likes"
                  value={formatFollowers(user.avg_likes)}
                  icon={<Heart className="h-5 w-5 text-red-400" />}
                />
              )}
              {user.avg_comments !== undefined && (
                <StatCard
                  label="Avg Comments"
                  value={formatNumber(user.avg_comments)}
                  icon={<MessageCircle className="h-5 w-5 text-green-400" />}
                />
              )}
            </motion.div>

            <motion.div
              className="pt-6 border-t border-purple-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                onClick={handleAddToList}
                className={cn(
                  "w-full gap-2 font-body",
                  isSaved ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                )}
                size="lg"
              >
                {isSaved ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Saved to List</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add to List</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <motion.div
      className="bg-white/5 border border-purple-500/20 rounded-xl p-5 text-center hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(168, 85, 247, 0.15)" }}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-xl md:text-2xl font-bold text-white font-sans">{value}</div>
      <div className="text-sm text-gray-400 mt-1 font-body">{label}</div>
    </motion.div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
