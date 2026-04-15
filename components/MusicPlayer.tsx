'use client'

interface Props {
  isPlaying: boolean
}

const PLAYLIST_ID = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID

export default function MusicPlayer({ isPlaying }: Props) {
  // Syncing player state with navbar icon
  if (!PLAYLIST_ID || !isPlaying) return null

  return (
    <div 
      className="fixed pointer-events-none opacity-0"
      style={{ width: 1, height: 1, overflow: 'hidden', left: -100, top: -100 }}
    >
      <iframe
        width="100"
        height="100"
        src={`https://www.youtube.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&loop=1&controls=1&modestbranding=1`}
        title="YouTube Music"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
    </div>
  )
}

