'use client'

import { useEffect, useRef } from 'react'
import { track } from './firebase'

/** Fires one analytics event the first time a section is at least 40% on screen. */
export function useSeen<T extends HTMLElement>(section: string, extra: Record<string, string | undefined> = {}) {
  const ref = useRef<T>(null)
  const sent = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (!sent.current && entries.some((e) => e.isIntersecting)) {
          sent.current = true
          track('section_view', { section, ...extra })
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])
  return ref
}
