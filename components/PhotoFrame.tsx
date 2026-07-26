"use client";

import Image from "next/image";
import type { Photo } from "@/lib/types";

/**
 * One sizes string for every placement, so a given device resolves to exactly
 * one image variant. That is what lets PhotoPreloader warm the same URL the
 * real frame will later request — different sizes strings would fetch twice.
 * Phones show the inline frames (up to 260px); wider screens the floating ones.
 *
 * Stated in px, not vw, on purpose: a `vw` unit makes next/image drop every
 * srcset candidate below deviceSizes[0] * ratio, which left a 124px frame
 * downloading the 640w variant — 218KB where 47KB would do.
 */
export const PHOTO_SIZES = "(max-width: 640px) 260px, 124px";

/** Optimizing an animated GIF would flatten it to a single frame. */
export const isAnimated = (src: string) => src.toLowerCase().endsWith(".gif");

interface Props {
  photo: Photo;
  /** CSS width of the picture inside the frame. */
  width: string;
  eager?: boolean;
}

/** A picture in a little polaroid frame, at its own natural aspect ratio. */
export default function PhotoFrame({ photo, width, eager }: Props) {
  return (
    <div
      style={{
        background: "#fffaf8",
        padding: 7,
        paddingBottom: 20,
        borderRadius: 3,
        boxShadow: "0 12px 30px rgba(45,27,46,0.22)",
      }}
    >
      <div className="overflow-hidden" style={{ width, background: "#f7e7ee" }}>
        {photo.kind === "video" ? (
          <video
            src={photo.src}
            width={photo.width}
            height={photo.height}
            autoPlay
            loop
            playsInline
            // Muted is what makes autoplay legal; set on the element too,
            // because React does not always emit it as an HTML attribute.
            muted
            ref={(el) => {
              if (el) el.muted = true;
            }}
            preload={eager ? "auto" : "metadata"}
            className="block w-full h-auto"
          />
        ) : (
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes={PHOTO_SIZES}
            loading={eager ? "eager" : "lazy"}
            // Natural aspect ratio — neither stretched nor cropped
            className="block w-full h-auto"
            unoptimized={isAnimated(photo.src)}
          />
        )}
      </div>
      <p
        className="text-center font-serif text-[11px] leading-none mt-[7px]"
        style={{ color: "#c2587a" }}
        aria-hidden="true"
      >
        ♡
      </p>
    </div>
  );
}
