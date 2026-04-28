'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition () {
  const pathname = usePathname()
  const [width, setWidth] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)

    requestAnimationFrame(() => {
      if (!mountedRef.current) return
      setOpacity(1)
      setWidth(85)
    })

    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      setWidth(100)
      setTimeout(() => {
        if (mountedRef.current) setOpacity(0)
      }, 200)
      setTimeout(() => {
        if (mountedRef.current) setWidth(0)
      }, 500)
    }, 350)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pathname])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 100,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'var(--teal)',
          borderRadius: '0 2px 2px 0',
          width: `${width}%`,
          opacity,
          transition:
            width === 0
              ? 'none'
              : width === 100
              ? 'width 0.2s ease, opacity 0.3s ease'
              : 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 8px var(--teal)'
        }}
      />
    </div>
  )
}
