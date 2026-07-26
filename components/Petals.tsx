"use client";

import { motion } from "framer-motion";

const GLYPHS = ["✿", "❀", "♡", "✦", "✧", "❋", "✾"];

/**
 * Deterministic pseudo-random. Math.random() would produce different values on
 * the server and the client, which breaks hydration for markup rendered on both.
 */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Fixed precision so the server's style string and the client's match exactly. */
const round = (n: number) => Number(n.toFixed(2));

interface Props {
  count?: number;
  /** Any CSS colour value. */
  color?: string;
  minDuration?: number;
  durationRange?: number;
  maxDelay?: number;
  peakOpacity?: number;
  repeat?: boolean;
}

/** Drifting petals. Fills its nearest positioned ancestor. */
export default function Petals({
  count = 14,
  color = "rgba(194,88,122,0.18)",
  minDuration = 11,
  durationRange = 7,
  maxDelay = 6,
  peakOpacity = 1,
  repeat = true,
}: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{
            color,
            fontSize: `${round(16 + seeded(i + 1) * 18)}px`,
            left: `${round(seeded(i + 7) * 100)}%`,
          }}
          initial={{ y: "110vh", rotate: 0, opacity: 0 }}
          animate={{ y: "-15vh", rotate: 360, opacity: [0, peakOpacity, 0] }}
          transition={{
            duration: minDuration + seeded(i + 13) * durationRange,
            delay: seeded(i + 21) * maxDelay,
            ease: "linear",
            repeat: repeat ? Infinity : 0,
          }}
        >
          {GLYPHS[i % GLYPHS.length]}
        </motion.span>
      ))}
    </div>
  );
}
