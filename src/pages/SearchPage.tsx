"use client";

import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import type { Platform } from "@/types";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(() => filterProfiles(allProfiles, searchQuery), [allProfiles, searchQuery]);

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  };

  return (
    <Layout title="Find Influencers">
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-600 mb-8 text-center">
          Browse top creators across social platforms
        </p>

        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filtered.length}</span> of{" "}
            <span className="font-medium text-gray-900">{allProfiles.length}</span> on{" "}
            <span className="capitalize font-medium">{platform}</span>
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