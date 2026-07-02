"use client";

import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useAppStore } from "@/store/useAppStore";
import { Plus, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";

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

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "unknown") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

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
          <p className="text-gray-500">Invalid profile</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
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
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Could not load profile details for @{username}</p>
          <Link to="/" className="text-blue-600 hover:underline">
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
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-4xl mx-auto">
              <div className="relative flex-shrink-0">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={user.picture} alt={user.fullname} />
                  <AvatarFallback className="text-3xl font-medium bg-gradient-to-br from-gray-200 to-gray-300">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.is_verified && (
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm shadow-lg">
                    ✓
                  </span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">@{user.username}</h2>
                  {user.is_verified && (
                    <Badge variant="verified" className="flex items-center gap-1">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-lg">{user.fullname}</p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white",
                      getPlatformColor(platform)
                    )}
                  >
                    <span>{getPlatformIcon(platform)}</span>
                    <span className="capitalize">{platform}</span>
                  </span>
                  {user.url && (
                    <Button
                      variant="outline"
                      size="sm"
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
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bio</h3>
                <p className="text-gray-700 leading-relaxed">{user.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Followers"
                value={formatFollowers(user.followers)}
                icon="👥"
              />
              {user.engagement_rate !== undefined && (
                <StatCard
                  label="Engagement Rate"
                  value={formatEngagementRate(user.engagement_rate)}
                  icon="📊"
                />
              )}
              {user.posts_count !== undefined && (
                <StatCard
                  label="Posts"
                  value={formatNumber(user.posts_count)}
                  icon="📝"
                />
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <StatCard
                  label="Avg Views"
                  value={formatFollowers(user.avg_views)}
                  icon="👁️"
                />
              )}
              {user.avg_likes !== undefined && (
                <StatCard
                  label="Avg Likes"
                  value={formatFollowers(user.avg_likes)}
                  icon="❤️"
                />
              )}
              {user.avg_comments !== undefined && (
                <StatCard
                  label="Avg Comments"
                  value={formatNumber(user.avg_comments)}
                  icon="💬"
                />
              )}
            </div>

            <div className="pt-6 border-t border-gray-100">
              <Button
                onClick={handleAddToList}
                className={cn(
                  "w-full gap-2",
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
      <span className="text-2xl mb-2 block">{icon}</span>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
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