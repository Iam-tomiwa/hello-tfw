'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  onSuccess: (passcode: string, role: 'her' | 'admin') => void
  onClose: () => void
}

export default function PasscodeModal({ onSuccess, onClose }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/messages/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: value }),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess(value, data.role)
      } else {
        setError('Wrong passcode. Try again 💕')
        setValue('')
        inputRef.current?.focus()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(45,27,46,0.55)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: '#fffaf8', boxShadow: '0 24px 64px rgba(45,27,46,0.18)' }}
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold" style={{ color: '#2d1b2e' }}>
              Secret Entry
            </h2>
            <p className="text-sm font-sans mt-1" style={{ color: '#7d5a6e' }}>
              Enter your passcode to add a message
            </p>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#c4a0b8' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            placeholder="Enter passcode..."
            className="w-full px-4 py-3 rounded-xl border font-sans outline-none transition-all placeholder:text-[#c4a0b8]"
            style={{
              borderColor: error ? '#c2587a' : '#edadc0',
              background: '#fdf6f0',
              color: '#2d1b2e',
            }}
            autoComplete="current-password"
          />

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
            disabled={loading || !value.trim()}
            className="w-full py-3 rounded-xl font-sans font-medium text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #c2587a, #a8729a)' }}
          >
            {loading ? 'Checking...' : 'Enter 💕'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}
