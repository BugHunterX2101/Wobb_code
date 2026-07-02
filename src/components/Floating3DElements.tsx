"use client";

import { motion } from "framer-motion";

const floatingElements = [
  { emoji: "📱", size: 32, x: "5%", delay: 0, duration: 20 },
  { emoji: "✨", size: 24, x: "15%", delay: 2, duration: 25 },
  { emoji: "🔥", size: 28, x: "25%", delay: 4, duration: 22 },
  { emoji: "💎", size: 20, x: "40%", delay: 1, duration: 28 },
  { emoji: "🚀", size: 30, x: "55%", delay: 3, duration: 24 },
  { emoji: "⭐", size: 22, x: "70%", delay: 5, duration: 26 },
  { emoji: "💜", size: 26, x: "82%", delay: 0.5, duration: 23 },
  { emoji: "🎯", size: 24, x: "92%", delay: 3.5, duration: 21 },
  { emoji: "📈", size: 28, x: "10%", delay: 6, duration: 27 },
  { emoji: "👑", size: 26, x: "48%", delay: 2.5, duration: 29 },
  { emoji: "💡", size: 22, x: "65%", delay: 7, duration: 22 },
  { emoji: "🌟", size: 30, x: "88%", delay: 1.5, duration: 25 },
];

export function Floating3DElements() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: el.x,
            fontSize: el.size,
            filter: "blur(0.5px)",
          }}
          initial={{ y: "110vh", opacity: 0, rotate: 0, scale: 0.5 }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.7, 0.7, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1.2, 1, 0.8],
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
              textShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
            }}
          >
            {el.emoji}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
