/** A picture from public/our-pictures, with its intrinsic dimensions. */
export interface Photo {
  src: string;
  width: number;
  height: number;
  /** Clips are served as muted looping video — far smaller than a GIF. */
  kind: "image" | "video";
}

export interface Message {
  id: string;
  content: string;
  author_name: string;
  category: string;
  created_at: string;
}

export const ALL_CATEGORIES = [
  "All",
  "Prayer",
  "Message",
  "Thanksgiving",
  "Quote",
  "Memory",
] as const;

export type Category = (typeof ALL_CATEGORIES)[number];

export const MESSAGE_CATEGORIES = [
  "Prayer",
  "Message",
  "Thanksgiving",
  "Quote",
  "Memory",
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];
