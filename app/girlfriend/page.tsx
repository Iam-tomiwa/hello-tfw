import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import GirlfriendLetter from "@/components/GirlfriendLetter";
import { imageSize } from "@/lib/imageSize";
import type { Photo } from "@/lib/types";

export const metadata: Metadata = {
  title: "You have mail 💌",
  description: "A letter for my soft babe",
};

const PHOTO_DIR = path.join(process.cwd(), "public", "our-pictures");
const MEDIA_FILE = /\.(png|jpe?g|gif|webp|avif|mp4|webm)$/i;
const VIDEO_FILE = /\.(mp4|webm)$/i;

/** Whatever is sitting in public/our-pictures — drop files in, no code change. */
async function readPhotos(): Promise<Photo[]> {
  let files: string[];
  try {
    files = (await readdir(PHOTO_DIR))
      .filter((f) => MEDIA_FILE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return []; // folder missing or unreadable — petals only
  }

  return Promise.all(
    files.map(async (file) => {
      // Real dimensions, so each frame keeps the photo's own shape
      const buf = await readFile(path.join(PHOTO_DIR, file));
      const { width, height } = imageSize(buf);

      return {
        src: `/our-pictures/${encodeURIComponent(file)}`,
        width,
        height,
        kind: VIDEO_FILE.test(file) ? "video" : "image",
      } satisfies Photo;
    }),
  );
}

export default async function GirlfriendPage() {
  const photos = await readPhotos();

  return <GirlfriendLetter photos={photos} />;
}
