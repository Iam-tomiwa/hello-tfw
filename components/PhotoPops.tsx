"use client";

import { motion, useReducedMotion } from "framer-motion";
import PhotoFrame from "./PhotoFrame";
import type { Photo } from "@/lib/types";

interface Props {
  photos: Photo[];
  /** How many have been earned by the typing so far. They never leave. */
  revealed: number;
}

/**
 * Resting places around the edges, so the centre column stays clear. Fixed
 * rather than random, so photos never land on top of each other. The ones not
 * marked `onMobile` are hidden on narrow screens, where there is no margin.
 *
 * Every spot keeps a whole frame on screen: `max()` holds a pixel floor at the
 * sides, and the lower half anchors to `bottom` so nothing runs off the end.
 */
const SPOTS = [
  { pos: { left: "max(12px, 2%)", top: "18%" }, rotate: -6 },
  { pos: { right: "max(12px, 2%)", top: "27%" }, rotate: 5 },
  { pos: { left: "max(14px, 4%)", bottom: "30%" }, rotate: 7 },
  { pos: { right: "max(14px, 3%)", bottom: "17%" }, rotate: -5 },
  { pos: { left: "max(16px, 9%)", top: "47%" }, rotate: 4 },
  { pos: { right: "max(16px, 9%)", top: "55%" }, rotate: -8 },
  { pos: { left: "max(12px, 3%)", bottom: "6%" }, rotate: 6 },
  { pos: { right: "max(16px, 8%)", top: "13%" }, rotate: -4 },
];

/** Framed photos that float up into place one by one as the letter is read. */
export default function PhotoPops({ photos, revealed }: Props) {
  const reduceMotion = useReducedMotion();

  if (photos.length === 0) return null;

  return (
    // Desktop only — on phones the pictures sit inline in the letter instead,
    // where there is no margin to float in without covering the text.
    <div className="hidden sm:block fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {photos.slice(0, revealed).map((photo, i) => {
        const spot = SPOTS[i % SPOTS.length];
        // More photos than spots: nudge each extra lap so they don't stack
        const lap = Math.floor(i / SPOTS.length);

        return (
          <div
            key={photo.src}
            className="absolute"
            style={{
              ...spot.pos,
              transform: lap ? `translate(${lap * 18}px, ${lap * -30}px)` : undefined,
            }}
          >
            {/* Floats up into place, then stays */}
            <motion.div
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 140, scale: 0.8 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.5 }
                  : { type: "spring", stiffness: 90, damping: 15, mass: 1 }
              }
            >
              {/* Settled, but never still — keeps drifting and swaying */}
              <motion.div
                initial={{ rotate: spot.rotate }}
                animate={
                  reduceMotion
                    ? { rotate: spot.rotate }
                    : {
                        y: [0, -18, 0],
                        rotate: [
                          spot.rotate - 2,
                          spot.rotate + 2,
                          spot.rotate - 2,
                        ],
                      }
                }
                transition={{
                  duration: 5 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <PhotoFrame photo={photo} width="clamp(84px, 22vw, 124px)" />
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
