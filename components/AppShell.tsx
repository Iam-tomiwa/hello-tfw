"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AppHeader from "./AppHeader";
import MusicPlayer from "./MusicPlayer";
import WelcomeAnimation from "./WelcomeAnimation";
import { MusicContext, type MusicControls } from "./MusicContext";

/**
 * Chrome shared by every route: the welcome preloader, the sticky header and
 * the background music player. Lives in the root layout, so state survives
 * client-side navigation between pages.
 */
export default function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleWelcomeComplete = useCallback(() => setShowWelcome(false), []);
  const toggleMusic = useCallback(() => setIsMusicPlaying((p) => !p), []);
  const playMusic = useCallback(() => setIsMusicPlaying(true), []);

  const music = useMemo<MusicControls>(
    () => ({ isPlaying: isMusicPlaying, play: playMusic, toggle: toggleMusic }),
    [isMusicPlaying, playMusic, toggleMusic],
  );

  return (
    <MusicContext.Provider value={music}>
      <AnimatePresence>
        {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      </AnimatePresence>

      <AppHeader isMusicPlaying={isMusicPlaying} onToggleMusic={toggleMusic} />

      {children}

      <MusicPlayer isPlaying={isMusicPlaying} />
    </MusicContext.Provider>
  );
}
