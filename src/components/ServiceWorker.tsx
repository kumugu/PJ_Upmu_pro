'use client'
import { useEffect } from 'react'

export default function ServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
      })
    }
  }, [])

  return null
}
