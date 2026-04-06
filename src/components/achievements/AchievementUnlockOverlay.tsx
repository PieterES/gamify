"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AchievementDef } from "@/types/gamification";

const RARITY_CONFIG = {
  common: {
    border: "border-gray-400",
    text: "text-gray-300",
    glow: "0 0 40px rgba(156,163,175,0.4)",
    particle: "#9ca3af",
    label: "COMMON",
  },
  rare: {
    border: "border-blue-400",
    text: "text-blue-300",
    glow: "0 0 60px rgba(96,165,250,0.5)",
    particle: "#60a5fa",
    label: "RARE",
  },
  epic: {
    border: "border-purple-500",
    text: "text-purple-300",
    glow: "0 0 80px rgba(168,85,247,0.6)",
    particle: "#a855f7",
    label: "EPIC",
  },
  legendary: {
    border: "border-yellow-400",
    text: "text-yellow-300",
    glow: "0 0 100px rgba(251,191,36,0.7)",
    particle: "#fbbf24",
    label: "LEGENDARY",
  },
};

const ACHIEVEMENT_EMOJI: Record<string, string> = {
  first_blood: "🩸",
  on_fire: "🔥",
  unstoppable: "⚡",
  speed_demon: "💨",
  domain_master_identity: "🛡️",
  domain_master_networking: "🌐",
  domain_master_compute: "💻",
  domain_master_defender: "⚔️",
  all_domains_mastered: "👑",
  boss_slayer: "🐲",
  perfect_boss: "✨",
  streak_7: "📅",
  streak_30: "🗓️",
  centurion: "💯",
  completionist: "✅",
  night_owl: "🦉",
  speed_run: "🏃",
};

const AUTO_ADVANCE_MS = 4000;

const PARTICLE_COUNT = 20;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  angle: (i / PARTICLE_COUNT) * 360,
  distance: 90 + (i % 3) * 35,
  size: i % 4 === 0 ? 6 : i % 3 === 0 ? 4 : 3,
  delay: (i / PARTICLE_COUNT) * 0.15,
}));

interface Props {
  achievements: AchievementDef[];
  onComplete: () => void;
}

export function AchievementUnlockOverlay({ achievements, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [cardKey, setCardKey] = useState(0);

  const current = achievements[idx];

  function advance() {
    if (idx + 1 < achievements.length) {
      setIdx((i) => i + 1);
      setCardKey((k) => k + 1);
    } else {
      onComplete();
    }
  }

  // Auto-advance timer
  useEffect(() => {
    const timer = setTimeout(advance, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  if (!current) return null;

  const rarity = RARITY_CONFIG[current.rarity];
  const emoji = ACHIEVEMENT_EMOJI[current.key] ?? "🏅";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={advance}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.025) 2px, rgba(0,212,255,0.025) 4px)",
        }}
      />

      {/* Particles burst */}
      <AnimatePresence>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * p.distance;
          const ty = Math.sin(rad) * p.distance;
          return (
            <motion.div
              key={`${cardKey}-p${p.id}`}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: tx,
                y: ty,
                scale: [0, 1.4, 1, 0],
              }}
              transition={{
                duration: 0.9,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: rarity.particle,
                boxShadow: `0 0 ${p.size * 3}px ${rarity.particle}`,
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Shockwave ring */}
      <motion.div
        key={`ring-${cardKey}`}
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute rounded-full pointer-events-none border-2"
        style={{
          width: 200,
          height: 200,
          borderColor: rarity.particle,
        }}
      />

      {/* Main card */}
      <motion.div
        key={`card-${cardKey}`}
        initial={{ scale: 0.4, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
        className={`relative border-2 ${rarity.border} bg-[#0f1117] rounded-2xl p-8 max-w-sm w-full mx-4 text-center`}
        style={{ boxShadow: rarity.glow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner scanline */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)",
          }}
        />

        {/* Flicker header */}
        <motion.div
          animate={{ opacity: [1, 0.6, 1, 0.8, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror" }}
          className="text-xs font-mono tracking-[0.25em] text-[#00d4ff] mb-3 uppercase"
        >
          ⚡ Achievement Unlocked ⚡
        </motion.div>

        {/* Rarity badge */}
        <div className={`text-xs font-mono tracking-widest mb-4 ${rarity.text}`}>
          {rarity.label}
        </div>

        {/* Emoji icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
          className="text-7xl mb-5 leading-none"
          style={{ filter: `drop-shadow(0 0 20px ${rarity.particle})` }}
        >
          {emoji}
        </motion.div>

        {/* Name */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl font-bold mb-2 ${rarity.text}`}
        >
          {current.name}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#64748b] text-sm mb-6"
        >
          {current.description}
        </motion.p>

        {/* XP reward */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.45 }}
          className="text-3xl font-mono font-bold text-[#ffb800] mb-6"
          style={{ textShadow: "0 0 20px rgba(251,191,36,0.8)" }}
        >
          +{current.xpReward} XP
        </motion.div>

        {/* Countdown bar */}
        <div className="w-full h-0.5 bg-[#1e2d3d] rounded-full overflow-hidden mb-4">
          <motion.div
            key={`bar-${cardKey}`}
            initial={{ scaleX: 1, originX: 0 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
            className="h-full rounded-full"
            style={{ background: rarity.particle }}
          />
        </div>

        {/* Pagination dots */}
        {achievements.length > 1 && (
          <div className="flex gap-2 justify-center mb-3">
            {achievements.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === idx ? "w-4 h-2 bg-[#00d4ff]" : "w-2 h-2 bg-[#1e2d3d]"
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-[#64748b] text-xs">
          {achievements.length > 1 && idx + 1 < achievements.length
            ? "Click to skip ahead"
            : "Click to continue"}
        </div>
      </motion.div>
    </motion.div>
  );
}
