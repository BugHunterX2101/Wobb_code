import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

export interface SavedProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;
}

interface AppState {
  savedProfiles: SavedProfile[];
  searchQuery: string;
  selectedPlatform: Platform;
  addProfile: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfile: (userId: string) => void;
  isProfileSaved: (userId: string) => boolean;
  clearAllProfiles: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: Platform) => void;
  getProfilesByPlatform: (platform: Platform) => SavedProfile[];
  getSavedProfilesCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedProfiles: [],
      searchQuery: "",
      selectedPlatform: "instagram",

      addProfile: (profile, platform) => {
        const { savedProfiles } = get();
        const exists = savedProfiles.some((p) => p.user_id === profile.user_id);
        if (exists) return false;

        const newProfile: SavedProfile = {
          ...profile,
          platform,
          addedAt: Date.now(),
        };

        set({ savedProfiles: [newProfile, ...savedProfiles] });
        return true;
      },

      removeProfile: (userId) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.user_id !== userId),
        })),

      isProfileSaved: (userId) => get().savedProfiles.some((p) => p.user_id === userId),

      clearAllProfiles: () => set({ savedProfiles: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      getProfilesByPlatform: (platform) =>
        get().savedProfiles.filter((p) => p.platform === platform),

      getSavedProfilesCount: () => get().savedProfiles.length,
    }),
    {
      name: "influencer-search-storage",
      partialize: (state) => ({
        savedProfiles: state.savedProfiles,
      }),
    }
  )
);