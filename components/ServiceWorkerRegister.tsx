'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // In development the worker's cache-first rule for /_next/static pins old
    // chunks, which survive reloads and break HMR. Tear it down instead.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {})

      if ('caches' in window) {
        caches
          .keys()
          .then((keys) => keys.forEach((k) => caches.delete(k)))
          .catch(() => {})
      }
      return
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works, just no offline support
    })
  }, [])

  return null
}
