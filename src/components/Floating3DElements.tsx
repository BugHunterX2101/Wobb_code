"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Play,
  Disc3,
  Star,
  TrendingUp,
  Target,
  Diamond,
  Heart,
  Zap,
  Crown,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const floatingElements = [
  { Icon: Camera, size: 24, x: "5%", delay: 0, duration: 20, color: "#e1306c" },
  { Icon: Star, size: 20, x: "15%", delay: 2, duration: 25, color: "#fbbf24" },
  { Icon: Zap, size: 22, x: "25%", delay: 4, duration: 22, color: "#a855f7" },
  { Icon: Diamond, size: 18, x: "40%", delay: 1, duration: 28, color: "#34d399" },
  { Icon: Play, size: 24, x: "55%", delay: 3, duration: 24, color: "#ef4444" },
  { Icon: Star, size: 18, x: "70%", delay: 5, duration: 26, color: "#fbbf24" },
  { Icon: Heart, size: 22, x: "82%", delay: 0.5, duration: 23, color: "#ec4899" },
  { Icon: Target, size: 20, x: "92%", delay: 3.5, duration: 21, color: "#22d3ee" },
  { Icon: TrendingUp, size: 22, x: "10%", delay: 6, duration: 27, color: "#34d399" },
  { Icon: Crown, size: 22, x: "48%", delay: 2.5, duration: 29, color: "#f59e0b" },
  { Icon: Lightbulb, size: 20, x: "65%", delay: 7, duration: 22, color: "#fbbf24" },
  { Icon: Sparkles, size: 24, x: "88%", delay: 1.5, duration: 25, color: "#a855f7" },
  { Icon: Disc3, size: 22, x: "35%", delay: 8, duration: 26, color: "#06b6d4" },
  { Icon: Star, size: 16, x: "75%", delay: 9, duration: 28, color: "#fbbf24" },
];

export function Floating3DElements() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center"
          style={{
            left: el.x,
          }}
          initial={{ y: "110vh", opacity: 0, rotate: 0, scale: 0.3 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.5, 0.5, 0],
            rotate: [0, 180, 360],
            scale: [0.3, 1.1, 1, 0.6],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            style={{
              filter: `drop-shadow(0 0 12px ${el.color}40)`,
              color: el.color,
              opacity: 0.6,
            }}
          >
            <el.Icon size={el.size} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
