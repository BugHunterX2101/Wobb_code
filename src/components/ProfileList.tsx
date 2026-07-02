import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { Users } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {profiles.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="mt-2 text-lg font-semibold text-white font-sans">No creators found</h3>
          <p className="mt-1 text-sm text-gray-400 font-body">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : "No profiles available for this platform."}
          </p>
        </div>
      ) : (
        profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={onProfileClick}
          />
        ))
      )}
    </div>
  );
}
