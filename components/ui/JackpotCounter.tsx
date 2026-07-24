'use client'

import React, { useEffect, useState } from 'react'

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
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [end, duration])

  return (
    <span className="font-mono font-bold tracking-tight text-gradient-gold inline-block animate-jackpot">
      {prefix}
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}
