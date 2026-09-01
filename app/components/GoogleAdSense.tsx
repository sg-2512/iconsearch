'use client'

import { useEffect } from 'react'

export default function GoogleAdSense({ client }: { client: string }) {
  useEffect(() => {
    let loaded = false

    const loadAdSense = () => {
      if (loaded || document.getElementById('google-adsense-script')) return
      loaded = true
      cleanup()

      const script = document.createElement('script')
      script.id = 'google-adsense-script'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
      document.head.appendChild(script)
    }

    const events = ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown']
    const options: AddEventListenerOptions = { passive: true, once: true }

    events.forEach((event) => window.addEventListener(event, loadAdSense, options))

    let idleId: number | undefined
    let timerId: NodeJS.Timeout | undefined

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (
        window as Window & {
          requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number
        }
      ).requestIdleCallback(loadAdSense, { timeout: 3500 })
    } else {
      timerId = setTimeout(loadAdSense, 3500)
    }

    function cleanup() {
      events.forEach((event) => window.removeEventListener(event, loadAdSense))
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
  }, [client])

  return null
}
