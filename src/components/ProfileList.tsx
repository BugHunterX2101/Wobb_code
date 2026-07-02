import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

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
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No profiles found</h3>
          <p className="mt-1 text-sm text-gray-500">
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