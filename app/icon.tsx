import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #c2587a 0%, #a8729a 100%)',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '-0.5px',
      }}
    >
      TFW
    </div>,
    { ...size }
  )
}
