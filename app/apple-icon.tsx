import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #c2587a 0%, #a8729a 100%)',
        borderRadius: 38,
        fontSize: 62,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '-2px',
      }}
    >
      TFW
    </div>,
    { ...size }
  )
}
