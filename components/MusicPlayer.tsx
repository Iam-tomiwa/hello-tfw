'use client'

interface Props {
  isPlaying: boolean
  videoId?: string
}

const PLAYLIST_ID = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID

export default function MusicPlayer({ isPlaying, videoId }: Props) {
  const src = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&playsinline=1`
    : PLAYLIST_ID
      ? `https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&loop=1&controls=0&playsinline=1`
      : null

  if (!isPlaying || !src) return null

  return (
    <div 
      className="fixed pointer-events-none opacity-0"
      style={{ width: 1, height: 1, overflow: 'hidden', left: -100, top: -100 }}
    >
      <iframe
        width="200"
        height="200"
        src={src}
        title="Background music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ border: 'none' }}
      />
    </div>
  )
}

