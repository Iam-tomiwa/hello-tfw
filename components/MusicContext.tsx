"use client";

import { createContext, useContext } from "react";

export interface MusicControls {
  isPlaying: boolean;
  /** Start playing. Call from inside a click handler — browsers only allow
   *  audible playback to begin on a real user gesture. */
  play: () => void;
  toggle: () => void;
}

export const MusicContext = createContext<MusicControls | null>(null);

/** Background music controls, provided by AppShell in the root layout. */
export function useMusic(): MusicControls {
  const controls = useContext(MusicContext);
  if (!controls) throw new Error("useMusic must be used inside AppShell");
  return controls;
}
