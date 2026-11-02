"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Music2 } from "lucide-react";

interface Props {
  pathname: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Birthday" },
  { href: "/girlfriend", label: "Girlfriend" },
  { href: "/the-commitment", label: "Commitment" },
] as const;

export default function AppHeader({
  pathname,
  isMusicPlaying,
  onToggleMusic,
}: Props) {
  return (
    <header
      className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-3 sm:px-10 sm:py-4"
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
        <h1
          className="font-serif text-lg font-semibold"
          style={{ color: "#2d1b2e" }}
        >
          The Fiery Woman
        </h1>
        <p
          className="text-[11px] font-sans tracking-wider"
          style={{ color: "#a8729a" }}
        >
          your comfort corner 🌸
        </p>
      </Link>

      <nav
        aria-label="Main navigation"
        className="order-3 flex w-full items-center justify-center gap-1 sm:order-none sm:w-auto sm:gap-2"
      >
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="rounded-full px-3 py-2 font-sans text-xs font-medium outline-none transition-colors hover:bg-[#fce7ec] focus-visible:ring-2 focus-visible:ring-[#edadc0] sm:px-4 sm:text-sm"
              style={{
                color: active ? "#9b3a5e" : "#7d5a6e",
                background: active ? "rgba(252,231,236,0.8)" : "transparent",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

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
