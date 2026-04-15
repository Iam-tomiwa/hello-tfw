'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Message, Category } from '@/lib/types'
import CategoryFilter from './CategoryFilter'
import CardSwipeStack from './CardSwipeStack'

interface Props {
  initialMessages: Message[]
  newMessages: Message[]
  deletedIds: Set<string>
  canDeleteAll: boolean
  newMsgTimestamps: Record<string, number>
  onDelete: (id: string) => void
}

export default function MessageGrid({
  initialMessages,
  newMessages,
  deletedIds,
  canDeleteAll,
  newMsgTimestamps,
  onDelete,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const allMessages = useMemo(() => {
    const seen = new Set<string>()
    return [...newMessages, ...initialMessages].filter((m) => {
      if (seen.has(m.id) || deletedIds.has(m.id)) return false
      seen.add(m.id)
      return true
    })
  }, [initialMessages, newMessages, deletedIds])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return allMessages
    return allMessages.filter((m) => m.category === activeCategory)
  }, [allMessages, activeCategory])

  return (
    <div className="space-y-8">
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

      {filtered.length === 0 ? (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-serif text-2xl" style={{ color: '#c4a0b8' }}>
            No messages yet
          </p>
          <p className="font-sans text-sm mt-2" style={{ color: '#c4a0b8' }}>
            {activeCategory === 'All'
              ? 'Be the first to add a message 💕'
              : `No ${activeCategory} messages yet`}
          </p>
        </motion.div>
      ) : (
        <CardSwipeStack
          messages={filtered}
          canDeleteAll={canDeleteAll}
          newMsgTimestamps={newMsgTimestamps}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
