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

    const events = ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown', 'click']
    const options: AddEventListenerOptions = { passive: true, once: true }

    events.forEach((event) => window.addEventListener(event, loadAdSense, options))

    function cleanup() {
      events.forEach((event) => window.removeEventListener(event, loadAdSense))
    }

    return cleanup
  }, [client])

  return null
}
