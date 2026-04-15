'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Message } from '@/lib/types'
import MessageCard from './MessageCard'

// ─── Countdown delete button ─────────────────────────────────────────────────
const RADIUS = 15
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const WINDOW_MS = 10_000

function CountdownDelete({
  addedAt,
  onDelete,
}: {
  addedAt: number
  onDelete: () => void
}) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, WINDOW_MS - (Date.now() - addedAt))
  )

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      const r = Math.max(0, WINDOW_MS - (Date.now() - addedAt))
      setRemaining(r)
      if (r <= 0) clearInterval(id)
    }, 100)
    return () => clearInterval(id)
  }, [addedAt, remaining])

  if (remaining <= 0) return null

  const progress = remaining / WINDOW_MS // 1 → 0
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <motion.button
      onClick={onDelete}
      className="relative flex items-center justify-center"
      style={{ width: 36, height: 36 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Delete message"
      title={`Delete (${Math.ceil(remaining / 1000)}s)`}
    >
      {/* Ring */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        className="absolute inset-0"
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Track */}
        <circle cx="18" cy="18" r={RADIUS} fill="none" stroke="rgba(194,88,122,0.18)" strokeWidth="2.5" />
        {/* Progress */}
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
      {/* Icon */}
      <div
        className="relative flex items-center justify-center w-7 h-7 rounded-full"
        style={{ background: 'rgba(255,250,248,0.92)' }}
      >
        <Trash2 size={12} style={{ color: '#c2587a' }} />
      </div>
    </motion.button>
  )
}

// ─── Plain delete button (no countdown, for "her" role) ──────────────────────
function PlainDelete({ onDelete }: { onDelete: () => void }) {
  return (
    <motion.button
      onClick={onDelete}
      className="flex items-center justify-center w-8 h-8 rounded-full"
      style={{
        background: 'rgba(255,250,248,0.92)',
        boxShadow: '0 2px 8px rgba(45,27,46,0.1)',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      aria-label="Delete message"
    >
      <Trash2 size={13} style={{ color: '#c2587a' }} />
    </motion.button>
  )
}

// ─── Confirmation modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45,27,46,0.55)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-xs rounded-3xl p-7 flex flex-col gap-5"
        style={{ background: '#fffaf8', boxShadow: '0 24px 64px rgba(45,27,46,0.18)' }}
        initial={{ scale: 0.88, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 20 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p className="font-serif text-xl font-semibold mb-1" style={{ color: '#2d1b2e' }}>
            Delete this message?
          </p>
          <p className="font-sans text-sm" style={{ color: '#7d5a6e' }}>
            This cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-sans font-medium text-sm"
            style={{ background: 'rgba(194,88,122,0.08)', color: '#7d5a6e' }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl font-sans font-medium text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #c2587a, #a8729a)' }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main stack ──────────────────────────────────────────────────────────────
interface Props {
  messages: Message[]
  canDeleteAll: boolean
  newMsgTimestamps: Record<string, number>
  onDelete: (id: string) => void
}

type Dir = -1 | 1

export default function CardSwipeStack({
  messages,
  canDeleteAll,
  newMsgTimestamps,
  onDelete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const exitDir = useRef<Dir>(-1)

  const total = messages.length

  // Keep currentIndex in bounds when messages list changes (e.g. after delete)
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0

  function advance(dir: Dir) {
    exitDir.current = dir
    setCurrentIndex((i) => (Math.min(i, total - 1) + (dir === -1 ? 1 : -1) + total) % total)
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info
    if (offset.x < -80 || velocity.x < -500) advance(-1)
    else if (offset.x > 80 || velocity.x > 500) advance(1)
  }

  function msgAt(offset: number) {
    return messages[(safeIndex + offset + total * 10) % total]
  }

  function colorIdxAt(offset: number) {
    return (safeIndex + offset + total * 10) % total
  }

  if (total === 0) return null

  const topMsg = messages[safeIndex]
  const addedAt = newMsgTimestamps[topMsg.id]
  const withinWindow = addedAt !== undefined && Date.now() - addedAt < WINDOW_MS

  // Show delete button on top card if:
  //  - she can delete any message (HER_PASSCODE), OR
  //  - message was just added and still within 10s window
  const showDelete = canDeleteAll || withinWindow
  const showCountdown = !canDeleteAll && withinWindow

  const showDots = total <= 9

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Stack */}
      <div className="relative w-full" style={{ maxWidth: 360, height: 480 }}>

        {/* 3rd card — back */}
        {total > 2 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: 'rotate(-2deg) scale(0.88) translateY(20px)',
              transformOrigin: 'bottom center',
              zIndex: 0,
            }}
          >
            <MessageCard message={msgAt(2)} colorIndex={colorIdxAt(2)} className="h-full" />
          </div>
        )}

        {/* 2nd card — middle */}
        {total > 1 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: 'rotate(2deg) scale(0.94) translateY(10px)',
              transformOrigin: 'bottom center',
              zIndex: 1,
            }}
          >
            <MessageCard message={msgAt(1)} colorIndex={colorIdxAt(1)} className="h-full" />
          </div>
        )}

        {/* Top card — draggable */}
        <AnimatePresence>
          <motion.div
            key={safeIndex}
            className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
            style={{ zIndex: 2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.94, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{
              x: exitDir.current * 520,
              opacity: 0,
              rotate: exitDir.current * 18,
              transition: { duration: 0.27, ease: 'easeIn' },
            }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          >
            <MessageCard message={topMsg} colorIndex={safeIndex} className="h-full" />

            {/* Delete button — stop pointer events from triggering drag */}
            <AnimatePresence>
              {showDelete && (
                <motion.div
                  className="absolute top-3 right-3 z-10"
                  onPointerDown={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.18 }}
                >
                  {showCountdown ? (
                    <CountdownDelete
                      key={topMsg.id}
                      addedAt={addedAt!}
                      onDelete={() => setPendingDeleteId(topMsg.id)}
                    />
                  ) : (
                    <PlainDelete onDelete={() => setPendingDeleteId(topMsg.id)} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-5">
        <motion.button
          onClick={() => advance(1)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(194,88,122,0.1)', color: '#c2587a' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          aria-label="Previous"
          disabled={total <= 1}
        >
          <ChevronLeft size={20} />
        </motion.button>

        {showDots ? (
          <div className="flex items-center gap-1.5">
            {messages.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  exitDir.current = i >= safeIndex ? -1 : 1
                  setCurrentIndex(i)
                }}
                aria-label={`Go to message ${i + 1}`}
                className="rounded-full"
                animate={{
                  width: i === safeIndex ? 22 : 8,
                  opacity: i === safeIndex ? 1 : 0.4,
                  background: i === safeIndex ? '#c2587a' : '#c4a0b8',
                }}
                style={{ height: 8 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        ) : (
          <span
            className="font-sans text-sm tabular-nums"
            style={{ color: '#c4a0b8', minWidth: 52, textAlign: 'center' }}
          >
            {safeIndex + 1} / {total}
          </span>
        )}

        <motion.button
          onClick={() => advance(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(194,88,122,0.1)', color: '#c2587a' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          aria-label="Next"
          disabled={total <= 1}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {pendingDeleteId && (
          <ConfirmDeleteModal
            onConfirm={() => {
              onDelete(pendingDeleteId)
              setPendingDeleteId(null)
            }}
            onCancel={() => setPendingDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
