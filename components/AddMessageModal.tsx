'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { MESSAGE_CATEGORIES, MessageCategory, Message } from '@/lib/types'

interface Props {
  passcode: string
  role: 'her' | 'admin'
  onSuccess: (message: Message) => void
  onClose: () => void
}

export default function AddMessageModal({ passcode, role, onSuccess, onClose }: Props) {
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [category, setCategory] = useState<MessageCategory>('Message')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          author_name: authorName.trim() || undefined,
          category,
          passcode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      onSuccess(data)
    } catch {
      setError('Failed to add message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: 'rgba(45,27,46,0.55)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-8 overflow-y-auto max-h-[92dvh]"
        style={{ background: '#fffaf8', boxShadow: '0 -24px 64px rgba(45,27,46,0.18)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center mb-5">
          <div className="w-10 h-1 rounded-full" style={{ background: '#edadc0' }} />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold" style={{ color: '#2d1b2e' }}>
              Add a Message
            </h2>
            <p className="text-sm font-sans mt-1" style={{ color: '#7d5a6e' }}>
              {role === 'her' ? 'Adding as: Me 💕' : 'Adding a secret message 🤫'}
            </p>
          </div>
          <button onClick={onClose} style={{ color: '#c4a0b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Message content */}
          <div>
            <label className="block text-sm font-sans font-medium mb-2" style={{ color: '#7d5a6e' }}>
              Your message *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something beautiful..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border font-sans outline-none resize-none placeholder:text-[#c4a0b8]"
              style={{ borderColor: '#edadc0', background: '#fdf6f0', color: '#2d1b2e' }}
              required
            />
          </div>

          {/* Author name — admin only */}
          {role === 'admin' && (
            <div>
              <label className="block text-sm font-sans font-medium mb-2" style={{ color: '#7d5a6e' }}>
                Your name{' '}
                <span style={{ color: '#c4a0b8' }}>(optional — defaults to Anonymous)</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Mum, Best Friend, Babe..."
                className="w-full px-4 py-3 rounded-xl border font-sans outline-none placeholder:text-[#c4a0b8]"
                style={{ borderColor: '#edadc0', background: '#fdf6f0', color: '#2d1b2e' }}
              />
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-sans font-medium mb-3" style={{ color: '#7d5a6e' }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_CATEGORIES.map((cat) => {
                const isActive = category === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-all"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #c2587a, #a8729a)'
                        : 'rgba(194,88,122,0.08)',
                      color: isActive ? 'white' : '#7d5a6e',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-sm font-sans"
                style={{ color: '#c2587a' }}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-3.5 rounded-xl font-sans font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #c2587a, #a8729a)' }}
          >
            {loading ? 'Sending...' : 'Add Message 💌'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
