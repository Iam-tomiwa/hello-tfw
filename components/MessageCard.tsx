'use client'

import { Message } from '@/lib/types'

interface Props {
  message: Message
  colorIndex: number
  className?: string
}

const PALETTES = [
  { quote: '#c2587a', bg: '#fff0f5' },
  { quote: '#a8729a', bg: '#f8f0fc' },
  { quote: '#e8956d', bg: '#fff5ee' },
  { quote: '#7b9e8a', bg: '#f0f8f4' },
  { quote: '#9b7cb8', bg: '#f4f0fa' },
  { quote: '#b07070', bg: '#fff2f0' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function MessageCard({ message, colorIndex, className = '' }: Props) {
  const palette = PALETTES[colorIndex % PALETTES.length]

  return (
    <div
      className={`rounded-2xl p-7 flex flex-col overflow-hidden ${className}`}
      style={{
        background: '#fffaf8',
        boxShadow: '0 4px 28px rgba(45,27,46,0.09)',
      }}
    >
      {/* Quote mark */}
      <div
        className="text-7xl font-serif font-bold leading-none mb-3 select-none shrink-0"
        style={{ color: palette.quote, opacity: 0.6 }}
        aria-hidden="true"
      >
        "
      </div>

      {/* Message */}
      <p
        className="font-serif text-xl leading-relaxed flex-1 overflow-y-auto"
        style={{ color: '#2d1b2e' }}
      >
        {message.content}
      </p>

      {/* Footer */}
      <div className="mt-6 flex items-end justify-between gap-2 shrink-0">
        <div>
          <p
            className="text-[11px] tracking-[0.2em] uppercase font-sans font-semibold"
            style={{ color: palette.quote }}
          >
            {message.author_name}
          </p>
          <p className="text-[10px] font-sans mt-0.5" style={{ color: '#c4a0b8' }}>
            {formatDate(message.created_at)}
          </p>
        </div>
        <span
          className="text-[10px] font-sans font-medium px-2.5 py-1 rounded-full shrink-0"
          style={{ background: palette.bg, color: palette.quote }}
        >
          {message.category}
        </span>
      </div>
    </div>
  )
}
