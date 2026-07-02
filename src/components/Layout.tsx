import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SavedProfilesPanel } from "./SavedProfilesPanel";
import { Background3D } from "./Background3D";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showSavedProfiles?: boolean;
}

const platforms = [
  { path: "/", label: "Instagram", icon: "📷" },
  { path: "/youtube", label: "YouTube", icon: "▶️" },
  { path: "/tiktok", label: "TikTok", icon: "🎵" },
];

export function Layout({ children, title, showSavedProfiles = true }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen text-white">
      <Background3D />
      <div className="relative z-10">
        <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform">
                  IH
                </div>
                <span className="text-lg font-bold font-sans bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  InfluencerHub
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {platforms.map((p) => {
                  const isActive = location.pathname === p.path;
                  return (
                    <Link
                      key={p.path}
                      to={p.path}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                {showSavedProfiles && <SavedProfilesPanel />}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden border-b border-purple-500/20 bg-black/30 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-1 py-2">
              {platforms.map((p) => {
                const isActive = location.pathname === p.path;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {title && (
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold font-sans bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                {title}
              </h1>
            </header>
          )}
          <div className="backdrop-blur-xl rounded-2xl bg-white/5 p-6 shadow-2xl shadow-purple-500/10 border border-purple-500/20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
