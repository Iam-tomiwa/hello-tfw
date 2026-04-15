/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Music, Music2 } from "lucide-react";
import WelcomeAnimation from "./WelcomeAnimation";
import MessageGrid from "./MessageGrid";
import PasscodeModal from "./PasscodeModal";
import AddMessageModal from "./AddMessageModal";
import MusicPlayer from "./MusicPlayer";
import { Message } from "@/lib/types";

interface Auth {
  passcode: string;
  role: "her" | "admin";
}

interface Props {
  initialMessages: Message[];
}

export default function MainClient({ initialMessages }: Props) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPasscode, setShowPasscode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  // id → client timestamp of when the message was added this session
  const [newMsgTimestamps, setNewMsgTimestamps] = useState<
    Record<string, number>
  >({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Restore session auth on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("tfw_auth");
      if (saved) setAuth(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem("tfw_auth");
    }
  }, []);

  const handleAddClick = useCallback(() => {
    if (auth) setShowAddModal(true);
    else setShowPasscode(true);
  }, [auth]);

  const handlePasscodeSuccess = useCallback(
    (code: string, role: "her" | "admin") => {
      const authData: Auth = { passcode: code, role };
      setAuth(authData);
      sessionStorage.setItem("tfw_auth", JSON.stringify(authData));
      setShowPasscode(false);
      setShowAddModal(true);
    },
    [],
  );

  const handleMessageAdded = useCallback((message: Message) => {
    setNewMessages((prev) => [message, ...prev]);
    setNewMsgTimestamps((prev) => ({ ...prev, [message.id]: Date.now() }));
    setShowAddModal(false);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!auth) return;
      try {
        const res = await fetch(`/api/messages/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode: auth.passcode }),
        });
        if (res.ok) {
          setDeletedIds((prev) => new Set([...prev, id]));
          setNewMessages((prev) => prev.filter((m) => m.id !== id));
        }
      } catch {
        // silently fail — message stays visible
      }
    },
    [auth],
  );

  return (
    <div
      className="min-h-screen max-w-screen overflow-x-hidden font-sans"
      style={{ background: "#fdf6f0" }}
    >
      <AnimatePresence>
        {showWelcome && (
          <WelcomeAnimation onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className="sticky top-0 z-30 px-5 sm:px-10 py-4 flex items-center justify-between"
        style={{
          background: "rgba(253,246,240,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(194,88,122,0.12)",
        }}
      >
        <div>
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
        </div>
        <motion.button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
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

      {/* Main content */}
      <main className="px-5 sm:px-10 py-10 max-w-5xl mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="font-serif text-3xl sm:text-4xl font-bold"
            style={{ color: "#2d1b2e" }}
          >
            Messages for You
          </h2>
          <p className="font-sans text-sm mt-2" style={{ color: "#7d5a6e" }}>
            Words of love, prayer &amp; encouragement — all for you ✨
          </p>
        </motion.div>

        <MessageGrid
          initialMessages={initialMessages}
          newMessages={newMessages}
          deletedIds={deletedIds}
          canDeleteAll={auth?.role === "her"}
          newMsgTimestamps={newMsgTimestamps}
          onDelete={handleDelete}
        />
      </main>

      <MusicPlayer isPlaying={isMusicPlaying} />

      {/* Floating add button */}
      <motion.button
        onClick={handleAddClick}
        className="fixed bottom-6 right-5 w-14 h-14 rounded-full flex items-center justify-center text-white z-40"
        style={{
          background: "linear-gradient(135deg, #c2587a, #a8729a)",
          boxShadow: "0 6px 24px rgba(194,88,122,0.42)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Add a message"
      >
        <Plus size={24} strokeWidth={2.5} />
      </motion.button>

      <AnimatePresence>
        {showPasscode && (
          <PasscodeModal
            onSuccess={handlePasscodeSuccess}
            onClose={() => setShowPasscode(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && auth && (
          <AddMessageModal
            passcode={auth.passcode}
            role={auth.role}
            onSuccess={handleMessageAdded}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
