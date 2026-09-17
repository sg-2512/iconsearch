'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    // 1. Initialize dataLayer & gtag immediately to capture any early events in memory without error
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', gaId)
    }

    let loaded = false
    const loadGtag = () => {
      if (loaded || document.getElementById('google-analytics-script')) return
      loaded = true
      cleanup()

      const script = document.createElement('script')
      script.id = 'google-analytics-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      document.head.appendChild(script)
    }

    const events = ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown', 'click']
    const options: AddEventListenerOptions = { passive: true, once: true }

    events.forEach((event) => window.addEventListener(event, loadGtag, options))

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        loadGtag()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility, { once: true })

    function cleanup() {
      events.forEach((event) => window.removeEventListener(event, loadGtag))
      document.removeEventListener('visibilitychange', handleVisibility)
    }

    return cleanup
  }, [gaId])

  return null
}
