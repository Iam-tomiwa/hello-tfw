/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import MessageGrid from "./MessageGrid";
import PasscodeModal from "./PasscodeModal";
import AddMessageModal from "./AddMessageModal";
import { Message } from "@/lib/types";

interface Auth {
  passcode: string;
  role: "her" | "admin";
}

interface Props {
  initialMessages: Message[];
}

export default function MainClient({ initialMessages }: Props) {
  const [showPasscode, setShowPasscode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  // id → client timestamp of when the message was added this session
  const [newMsgTimestamps, setNewMsgTimestamps] = useState<
    Record<string, number>
  >({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

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
      className="flex-1 max-w-screen overflow-x-hidden font-sans"
      style={{ background: "#fdf6f0" }}
    >
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
