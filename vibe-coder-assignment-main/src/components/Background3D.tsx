"use client";

import { useEffect, useState, useMemo } from "react";

const FloatingOrb = ({ emoji, label, color, size, left, delay, duration }: {
  emoji: string; label: string; color: string; size: string; left: string; delay: number; duration: number;
}) => (
  <div
    className="absolute rounded-full flex items-center justify-center"
    style={{
      width: size, height: size, left,
      background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}15)`,
      border: `2px solid ${color}30`,
      backdropFilter: "blur(8px)",
      animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
      top: "100%",
    }}
  >
    <span className="text-3xl md:text-5xl">{emoji}</span>
    <span className="absolute -bottom-6 text-[10px] md:text-xs font-semibold text-white/60 whitespace-nowrap">{label}</span>
  </div>
);

const FloatingHeart = ({ left, delay, duration, size }: {
  left: string; delay: number; duration: number; size: string;
}) => (
  <span
    className="absolute text-pink-400/40 select-none pointer-events-none"
    style={{
      left, fontSize: size,
      animation: `floatUp ${duration}s ease-in-out ${delay}s infinite`,
      top: "100%",
    }}
  >
    ♡
  </span>
);

const Sparkle = ({ left, delay, duration, size, color }: {
  left: string; delay: number; duration: number; size: string; color: string;
}) => (
  <div
    className="absolute rounded-full"
    style={{
      left, width: size, height: size,
      background: color,
      boxShadow: `0 0 ${parseInt(size) * 2}px ${color}`,
      animation: `sparkle ${duration}s ease-in-out ${delay}s infinite`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

const TorusRing = ({ left, size, rotation, delay, color }: {
  left: string; size: string; rotation: number; delay: number; color: string;
}) => (
  <div
    className="absolute rounded-full border-2 select-none pointer-events-none"
    style={{
      left, width: size, height: size,
      borderColor: `${color}40`,
      background: `conic-gradient(from ${rotation}deg, transparent, ${color}20, transparent)`,
      animation: `floatUp 20s ease-in-out ${delay}s infinite, spinSlow 30s linear infinite`,
      top: "110%",
      transform: `rotate(${rotation}deg)`,
    }}
  />
);

export function Background3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const orbConfigs = useMemo(() => [
    { emoji: "📷", label: "Instagram", color: "#e1306c", size: "120px", left: "8%", delay: 0, duration: 12 },
    { emoji: "▶️", label: "YouTube", color: "#ff0000", size: "140px", left: "42%", delay: 2, duration: 14 },
    { emoji: "🎵", label: "TikTok", color: "#000000", size: "110px", left: "78%", delay: 4, duration: 11 },
  ], []);

  const hearts = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      left: `${(i * 7.3 + 2) % 100}%`,
      delay: i * 0.7,
      duration: 10 + (i % 5) * 2,
      size: `${12 + (i % 4) * 6}px`,
    })),
    []
  );

  const sparkles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      left: `${(i * 3.7 + 1) % 100}%`,
      delay: i * 0.4,
      duration: 3 + (i % 3),
      size: `${3 + (i % 3) * 2}px`,
      color: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#fce7f3" : "#fbcfe8",
    })),
    []
  );

  const torusRings = useMemo(() => [
    { left: "5%", size: "200px", rotation: 30, delay: 0, color: "#f472b6" },
    { left: "70%", size: "160px", rotation: -45, delay: 3, color: "#a855f7" },
    { left: "85%", size: "240px", rotation: 15, delay: 6, color: "#ec4899" },
    { left: "25%", size: "180px", rotation: -20, delay: 9, color: "#c026d3" },
  ], []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-[#1a0033] via-[#2d1052] to-[#0d001a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(236,72,153,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(192,38,211,0.1),transparent_50%)]" />

        {sparkles.map((s, i) => (
          <Sparkle key={`s${i}`} {...s} />
        ))}

        {torusRings.map((r, i) => (
          <TorusRing key={`t${i}`} {...r} />
        ))}

        {orbConfigs.map((orb, i) => (
          <FloatingOrb key={`o${i}`} {...orb} />
        ))}

        {hearts.map((h, i) => (
          <FloatingHeart key={`h${i}`} {...h} />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0033] via-transparent to-transparent opacity-60" />
      </div>


    </>
  );
}