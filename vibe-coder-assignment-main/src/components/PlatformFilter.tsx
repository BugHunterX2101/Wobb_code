import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import type { Platform } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {PLATFORMS.map((platform) => (
          <Button
            key={platform}
            variant={selected === platform ? "default" : "outline"}
            onClick={() => onChange(platform)}
            className={cn(
              "gap-1.5 font-medium transition-all",
              selected === platform && "shadow-lg"
            )}
          >
            <span className="text-lg">{getPlatformIcon(platform)}</span>
            <span>{getPlatformLabel(platform)}</span>
          </Button>
        ))}
      </div>
      <SearchBar value={searchQuery} onChange={onSearchChange} placeholder="Search by username or name..." />
    </div>
  );
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

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}