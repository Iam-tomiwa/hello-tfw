"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Message } from "@/lib/types";
import MessageCard from "./MessageCard";

// Swiper imports
import { EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ─── Countdown delete button ─────────────────────────────────────────────────
const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const WINDOW_MS = 10_000;

function CountdownDelete({
  addedAt,
  onDelete,
}: {
  addedAt: number;
  onDelete: () => void;
}) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, WINDOW_MS - (Date.now() - addedAt)),
  );

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const r = Math.max(0, WINDOW_MS - (Date.now() - addedAt));
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 100);
    return () => clearInterval(id);
  }, [addedAt, remaining]);

  if (remaining <= 0) return null;

  const progress = remaining / WINDOW_MS; // 1 → 0
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="relative flex items-center justify-center"
      style={{ width: 36, height: 36 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Delete message"
      title={`Delete (${Math.ceil(remaining / 1000)}s)`}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        className="absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke="rgba(194,88,122,0.18)"
          strokeWidth="2.5"
        />
        <circle
          cx="18"
          cy="18"
          r={RADIUS}
          fill="none"
          stroke="#c2587a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="relative flex items-center justify-center w-7 h-7 rounded-full"
        style={{ background: "rgba(255,250,248,0.92)" }}
      >
        <Trash2 size={12} style={{ color: "#c2587a" }} />
      </div>
    </motion.button>
  );
}

// ─── Plain delete button (no countdown) ──────────────────────────────────────
function PlainDelete({ onDelete }: { onDelete: () => void }) {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="flex items-center justify-center w-8 h-8 rounded-full"
      style={{
        background: "rgba(255,250,248,0.92)",
        boxShadow: "0 2px 8px rgba(45,27,46,0.1)",
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Delete message"
    >
      <Trash2 size={13} style={{ color: "#c2587a" }} />
    </motion.button>
  );
}

// ─── Confirmation modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(45,27,46,0.55)",
        backdropFilter: "blur(10px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-xs rounded-3xl p-7 flex flex-col gap-5"
        style={{
          background: "#fffaf8",
          boxShadow: "0 24px 64px rgba(45,27,46,0.18)",
        }}
        initial={{ scale: 0.88, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p
            className="font-serif text-xl font-semibold mb-1"
            style={{ color: "#2d1b2e" }}
          >
            Delete this message?
          </p>
          <p className="font-sans text-sm" style={{ color: "#7d5a6e" }}>
            This cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-sans font-medium text-sm"
            style={{ background: "rgba(194,88,122,0.08)", color: "#7d5a6e" }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl font-sans font-medium text-sm text-white"
            style={{ background: "linear-gradient(135deg, #c2587a, #a8729a)" }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main stack ──────────────────────────────────────────────────────────────
interface Props {
  messages: Message[];
  canDeleteAll: boolean;
  newMsgTimestamps: Record<string, number>;
  onDelete: (id: string) => void;
}

export default function CardSwipeStack({
  messages,
  canDeleteAll,
  newMsgTimestamps,
  onDelete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const total = messages.length;

  if (total === 0) return null;

  const showDots = total <= 9;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Container with overflow visible for swiper shadows/stack */}
      <div className="relative w-full max-w-[90vw] sm:max-w-[480px] h-[380px] sm:h-[480px]">
        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards, Navigation, Pagination]}
          className="h-full w-full custom-swiper"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          cardsEffect={{
            perSlideOffset: 12,
            perSlideRotate: 3,
            rotate: true,
            slideShadows: false,
          }}
        >
          {messages.map((msg, index) => {
            const addedAt = newMsgTimestamps[msg.id];
            const withinWindow =
              // eslint-disable-next-line react-hooks/purity
              addedAt !== undefined && Date.now() - addedAt < WINDOW_MS;
            const showDelete = canDeleteAll || withinWindow;
            const showCountdown = !canDeleteAll && withinWindow;

            return (
              <SwiperSlide
                key={msg.id}
                className="rounded-2xl border border-primary overflow-hidden"
              >
                <div className="relative h-full w-full">
                  <MessageCard
                    message={msg}
                    colorIndex={index}
                    className="h-full"
                  />

                  {/* Delete button overlay */}
                  <AnimatePresence>
                    {showDelete && index === currentIndex && (
                      <motion.div
                        className="absolute top-3 right-3 z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {showCountdown ? (
                          <CountdownDelete
                            addedAt={addedAt!}
                            onDelete={() => setPendingDeleteId(msg.id)}
                          />
                        ) : (
                          <PlainDelete
                            onDelete={() => setPendingDeleteId(msg.id)}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-8">
          <motion.button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: "rgba(194,88,122,0.1)", color: "#c2587a" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            aria-label="Previous"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} />
          </motion.button>

          {showDots ? (
            <div className="flex items-center gap-2">
              {messages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperRef.current?.slideTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? 24 : 8,
                    height: 8,
                    background: i === currentIndex ? "#c2587a" : "#c4a0b8",
                    opacity: i === currentIndex ? 1 : 0.4,
                  }}
                  aria-label={`Go to message ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <span
              className="font-sans text-sm tabular-nums font-medium"
              style={{ color: "#c4a0b8", minWidth: 60, textAlign: "center" }}
            >
              {currentIndex + 1} / {total}
            </span>
          )}

          <motion.button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{ background: "rgba(194,88,122,0.1)", color: "#c2587a" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            aria-label="Next"
            disabled={currentIndex === total - 1}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {pendingDeleteId && (
          <ConfirmDeleteModal
            onConfirm={() => {
              onDelete(pendingDeleteId);
              setPendingDeleteId(null);
            }}
            onCancel={() => setPendingDeleteId(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-swiper .swiper-slide-shadow {
          background: rgba(45, 27, 46, 0.05) !important;
        }
        .custom-swiper {
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
}
