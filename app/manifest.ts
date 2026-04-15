import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Fiery Woman',
    short_name: 'TFW',
    description: 'Your personal comfort corner — messages of love, prayer & encouragement',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf6f0',
    theme_color: '#c2587a',
    orientation: 'portrait',
    categories: ['lifestyle', 'personalization'],
    icons: [
      {
        src: '/icon-192.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
