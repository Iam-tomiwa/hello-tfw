"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AppHeader from "./AppHeader";
import MusicPlayer from "./MusicPlayer";
import WelcomeAnimation from "./WelcomeAnimation";

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

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      </AnimatePresence>

      <AppHeader isMusicPlaying={isMusicPlaying} onToggleMusic={toggleMusic} />

      {children}

      <MusicPlayer isPlaying={isMusicPlaying} />
    </>
  );
}
