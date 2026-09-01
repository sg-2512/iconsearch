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
    // 1. Initialize dataLayer & gtag immediately to capture any early events without error
    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments)
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

    const events = ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown']
    const options: AddEventListenerOptions = { passive: true, once: true }

    events.forEach((event) => window.addEventListener(event, loadGtag, options))

    let idleId: number | undefined
    let timerId: NodeJS.Timeout | undefined

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (
        window as Window & {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number
        }
      ).requestIdleCallback(loadGtag, { timeout: 3500 })
    } else {
      timerId = setTimeout(loadGtag, 3500)
    }

    function cleanup() {
      events.forEach((event) => window.removeEventListener(event, loadGtag))
      if (timerId) clearTimeout(timerId)
      if (
        idleId !== undefined &&
        typeof window !== 'undefined' &&
        'cancelIdleCallback' in window
      ) {
        ;(
          window as Window & { cancelIdleCallback: (id: number) => void }
        ).cancelIdleCallback(idleId)
      }
    }

    return cleanup
  }, [gaId])

  return null
}
