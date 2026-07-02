import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

interface SelectedProfile extends UserProfileSummary {
  addedAt: number;
  platform: Platform;
}

interface AppState {
  selectedProfiles: SelectedProfile[];
  searchQuery: string;
  selectedPlatform: Platform;
  isProfileListOpen: boolean;
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  clearProfiles: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: Platform) => void;
  toggleProfileList: () => void;
  closeProfileList: () => void;
  isProfileSelected: (userId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],
      searchQuery: "",
      selectedPlatform: "instagram",
      isProfileListOpen: false,

      addProfile: (profile, platform) => {
        const exists = get().selectedProfiles.some((p) => p.user_id === profile.user_id);
        if (exists) return;

        const newProfile: SelectedProfile = {
          ...profile,
          platform,
          addedAt: Date.now(),
        };

        set((state) => ({
          selectedProfiles: [...state.selectedProfiles, newProfile],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter((p) => p.user_id !== userId),
        }));
      },

      clearProfiles: () => {
        set({ selectedProfiles: [] });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedPlatform: (platform) => {
        set({ selectedPlatform: platform, searchQuery: "" });
      },

      toggleProfileList: () => {
        set((state) => ({ isProfileListOpen: !state.isProfileListOpen }));
      },

      closeProfileList: () => {
        set({ isProfileListOpen: false });
      },

      isProfileSelected: (userId) => {
        return get().selectedProfiles.some((p) => p.user_id === userId);
      },
    }),
    {
      name: "wobb-selected-profiles",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedProfiles: state.selectedProfiles,
      }),
    }
  )
);