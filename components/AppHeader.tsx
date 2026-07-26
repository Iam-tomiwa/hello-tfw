"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Music2 } from "lucide-react";

interface Props {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function AppHeader({ isMusicPlaying, onToggleMusic }: Props) {
  return (
    <header
      className="sticky top-0 z-30 px-5 sm:px-10 py-4 flex items-center justify-between"
      style={{
        background: "rgba(253,246,240,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(194,88,122,0.12)",
      }}
    >
      <Link
        href="/"
        aria-label="The Fiery Woman — back to home"
        className="rounded-lg transition-opacity hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-[#edadc0]"
      >
        <h1 className="font-serif text-lg font-semibold" style={{ color: "#2d1b2e" }}>
          The Fiery Woman
        </h1>
        <p
          className="text-[11px] font-sans tracking-wider"
          style={{ color: "#a8729a" }}
        >
          your comfort corner 🌸
        </p>
      </Link>

      <motion.button
        onClick={onToggleMusic}
        className="p-2 rounded-full transition-colors relative"
        style={{ color: isMusicPlaying ? "#c2587a" : "#edadc0" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isMusicPlaying ? "Pause music" : "Play music"}
      >
        {isMusicPlaying ? (
          <Music2 size={24} className="animate-pulse" />
        ) : (
          <Music size={24} />
        )}
        {isMusicPlaying && (
          <motion.span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#c2587a]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.button>
    </header>
  );
}
