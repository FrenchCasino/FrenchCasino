'use client'

import React, { useEffect, useState, useRef } from 'react'

interface JackpotCounterProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function JackpotCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
}: JackpotCounterProps) {
  // SSR & First Client Render: Show the true end value for SEO
  const [count, setCount] = useState(end)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          // Start animation from 0
          let startTimestamp: number | null = null
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            
            // Ease-out cubic formula for smoother counting
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOutCubic * end))
            
            if (progress < 1) {
              window.requestAnimationFrame(step)
            } else {
              setCount(end) // Ensure it finishes exactly on end
            }
          }
          window.requestAnimationFrame(step)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <span ref={counterRef} className="font-mono font-bold tracking-tight text-gradient-gold inline-block animate-jackpot">
      {prefix}
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}
