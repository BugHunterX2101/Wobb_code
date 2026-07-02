import * as React from "react";
import { Plus, X, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useAppStore } from "@/store/useAppStore";
import { formatFollowers } from "@/lib/utils";
import { getPlatformIcon } from "./PlatformIcons";

export function SavedProfilesPanel() {
  const { savedProfiles, removeProfile, getSavedProfilesCount } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const count = getSavedProfilesCount();

  if (count === 0) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative gap-1.5 text-gray-300 hover:text-white">
            <Plus className="h-4 w-4" />
            <span>Add to List</span>
            <Badge variant="secondary" className="ml-1">
              0
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0 bg-gray-900/95 backdrop-blur-xl border-purple-500/30">
          <div className="p-4 text-center text-gray-400">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-body">Your list is empty</p>
            <p className="text-xs mt-1 font-body">Search for creators and add them to your list</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="relative gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20">
          <Users className="h-4 w-4" />
          <span>My List</span>
          <Badge variant="success" className="ml-1 bg-white/20 text-white border-white/30">
            {count}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 max-h-[60vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-purple-500/30">
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <DropdownMenuLabel className="font-semibold text-white font-sans">Saved Creators ({count})</DropdownMenuLabel>
        </div>
        <div className="max-h-[40vh] overflow-y-auto p-2">
          {savedProfiles.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm font-body">No creators saved yet</div>
          ) : (
            savedProfiles.map((profile) => (
              <div
                key={profile.user_id}
                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-purple-500/20">
                  <AvatarImage src={profile.picture} alt={profile.fullname} />
                  <AvatarFallback className="text-xs font-bold bg-purple-500/30 text-white">
                    {profile.fullname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate text-white font-sans">@{profile.username}</span>
                    <Badge variant="verified" className="text-xs px-1.5">
                      {getPlatformIcon(profile.platform, 12)}
                    </Badge>
                    {profile.is_verified && (
                      <Badge variant="verified" className="text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 truncate font-body">{profile.fullname}</div>
                  <div className="text-xs text-gray-500 font-body">{formatFollowers(profile.followers)} followers</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProfile(profile.user_id);
                    }}
                    aria-label="Remove from list"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="mx-2 bg-purple-500/20" />
        <div className="p-2">
          <Button
            variant="outline"
            className="w-full gap-2 border-purple-500/30 hover:bg-white/10 font-body"
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/";
            }}
          >
            <Plus className="h-4 w-4" />
            Add More Creators
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
