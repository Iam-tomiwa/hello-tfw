'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const PETALS = ['✿', '❀', '♡', '✦', '✧', '❋', '✾']

export default function WelcomeAnimation({ onComplete }: Props) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 1500)
    const t3 = setTimeout(() => setPhase(3), 3000)
    const t4 = setTimeout(() => onComplete(), 3900)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #f9c5d1 0%, #d4a0c8 45%, #e8a898 100%)',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {/* Floating petals */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-white/25 select-none"
                style={{
                  fontSize: `${16 + Math.random() * 18}px`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: '110vh', rotate: 0, opacity: 0 }}
                animate={{ y: '-10vh', rotate: 360, opacity: [0, 0.7, 0] }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              >
                {PETALS[i % PETALS.length]}
              </motion.span>
            ))}
          </div>

          {/* Content */}
          <div className="text-center px-10 relative z-10">
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <motion.p
                  className="text-white/75 tracking-[0.3em] uppercase mb-3 font-sans text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                >
                  Hello,
                </motion.p>
                <motion.h1
                  className="text-5xl sm:text-6xl font-serif font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Fiery Woman
                </motion.h1>
              </motion.div>
            )}

            {phase >= 2 && (
              <motion.p
                className="text-white/90 text-xl sm:text-2xl mt-6 font-serif italic"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                Welcome to your comfort corner
              </motion.p>
            )}

            {phase >= 2 && (
              <motion.div
                className="mt-10 flex justify-center gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block w-2 h-2 rounded-full bg-white/70"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.22,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
