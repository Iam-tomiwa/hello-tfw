"use client";

import Image from "next/image";
import { PHOTO_SIZES, isAnimated } from "./PhotoFrame";
import type { Photo } from "@/lib/types";

interface Props {
  photos: Photo[];
}

/**
 * Off-screen copies fetched as soon as the page loads, so a picture is already
 * in cache by the time it is revealed and appears instantly instead of
 * blanking. Uses PHOTO_SIZES, so the URL warmed here is byte-for-byte the one
 * the real frame requests later.
 *
 * Deliberately not `display: none` — that would let the browser skip the
 * fetch. A 1px clipped box off-screen still loads.
 */
export default function PhotoPreloader({ photos }: Props) {
  if (photos.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed opacity-0 pointer-events-none overflow-hidden"
      style={{ left: -9999, top: 0, width: 1, height: 1 }}
    >
      {photos.map((photo) =>
        photo.kind === "video" ? (
          // preload only — no autoPlay, so an off-screen copy burns no CPU
          <video key={photo.src} src={photo.src} preload="auto" muted />
        ) : (
          <Image
            key={photo.src}
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes={PHOTO_SIZES}
            loading="eager"
            unoptimized={isAnimated(photo.src)}
          />
        ),
      )}
    </div>
  );
}
