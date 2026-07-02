import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SavedProfilesPanel } from "./SavedProfilesPanel";
import { Background3D } from "./Background3D";
import { Floating3DElements } from "./Floating3DElements";

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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
} as const;

export function Layout({ children, title, showSavedProfiles = true }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen text-white">
      <Background3D />
      <Floating3DElements />
      <div className="relative z-10">
        <header className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
                <motion.div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  IH
                </motion.div>
                <span className="text-lg font-bold font-sans bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  InfluencerHub
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {platforms.map((p) => {
                  const isActive = location.pathname === p.path;
                  return (
                    <Link key={p.path} to={p.path}>
                      <motion.span
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "text-purple-300"
                            : "text-gray-400 hover:text-white"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeTab"
                            className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-500/30"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </span>
                      </motion.span>
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
                        : "text-gray-400"
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
            <motion.header
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold font-sans bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.header>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="backdrop-blur-xl rounded-2xl bg-white/5 p-6 shadow-2xl shadow-purple-500/10 border border-purple-500/20"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
