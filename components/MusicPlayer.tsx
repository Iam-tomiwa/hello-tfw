'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, ChevronDown, ChevronUp } from 'lucide-react'

const PLAYLIST_ID = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID

export default function MusicPlayer() {
  const [open, setOpen] = useState(false)

  if (!PLAYLIST_ID) return null

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col items-start">
      <AnimatePresence>
        {open && (
          <motion.div
            className="mb-3 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(194,88,122,0.28)' }}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <iframe
              width="260"
              height="150"
              src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&loop=1&controls=1&modestbranding=1`}
              title="Background Music"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="block"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-sans text-sm font-medium"
        style={{
          background: 'linear-gradient(135deg, #c2587a, #a8729a)',
          boxShadow: '0 4px 16px rgba(194,88,122,0.35)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Hide music player' : 'Show music player'}
      >
        <Music size={15} />
        <span>{open ? 'Hide' : 'Music'}</span>
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </motion.button>
    </div>
  )
}
