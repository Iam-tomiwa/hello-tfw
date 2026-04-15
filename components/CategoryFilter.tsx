'use client'

import { motion } from 'framer-motion'
import { ALL_CATEGORIES, Category } from '@/lib/types'

interface Props {
  active: Category
  onChange: (cat: Category) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {ALL_CATEGORIES.map((cat) => {
        const isActive = active === cat
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            className="relative shrink-0 px-4 py-2 rounded-full text-sm font-sans font-medium whitespace-nowrap"
            style={{
              color: isActive ? '#fffaf8' : '#7d5a6e',
              background: isActive ? 'transparent' : 'rgba(194,88,122,0.08)',
            }}
            whileTap={{ scale: 0.94 }}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #c2587a, #a8729a)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
