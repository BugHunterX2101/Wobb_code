"use client";

import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { getPlatformIcon } from "@/components/PlatformIcons";
import type { Platform } from "@/types";

const platformDescriptions: Record<Platform, string> = {
  instagram: "Discover top Instagram creators — from fashion to fitness, lifestyle to luxury.",
  youtube: "Find YouTube giants — vloggers, gamers, educators, and entertainment stars.",
  tiktok: "Explore TikTok sensations — viral trends, challenges, and creative content.",
};

function routeToPlatform(pathname: string): Platform {
  if (pathname === "/youtube") return "youtube";
  if (pathname === "/tiktok") return "tiktok";
  return "instagram";
}

export function SearchPage() {
  const location = useLocation();
  const platform = routeToPlatform(location.pathname);

  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, searchQuery), [allProfiles, searchQuery]);

  const title = `Top ${platform.charAt(0).toUpperCase() + platform.slice(1)} Creators`;

  return (
    <Layout title={title}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-purple-500/30 flex items-center justify-center">
            {getPlatformIcon(platform, 24)}
          </div>
          <p className="text-gray-300 font-body leading-relaxed">
            {platformDescriptions[platform]}
          </p>
        </div>

        <PlatformFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mb-4 flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400 font-body">
            Showing <span className="font-semibold text-white">{filtered.length}</span> of{" "}
            <span className="font-semibold text-white">{allProfiles.length}</span> creators
          </p>
        </div>

        <ProfileList
          profiles={filtered}
          platform={platform}
          searchQuery={searchQuery}
          onProfileClick={() => {}}
        />
      </div>
    </Layout>
  );
}
