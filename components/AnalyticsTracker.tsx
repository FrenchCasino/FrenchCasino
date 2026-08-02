'use client'

import { useEffect, useRef, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function TrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Retrieve or create visitor ID
    let visitorId = localStorage.getItem('fc_visitor_id')
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('fc_visitor_id', visitorId)
    }

    // Do not track admin, recruiter, or dashboard pages
    if (
      pathname.startsWith('/admin') || 
      pathname.startsWith('/recruiter') || 
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/api')
    ) {
      return
    }

    const currentPathCombined = pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
    if (lastPath.current === currentPathCombined) return
    lastPath.current = currentPathCombined

    const track = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || 'Direct',
            visitorId,
            search: searchParams.toString()
          })
        })
      } catch (err) {
        console.error('Failed to log page view:', err)
      }
    }

    // Delay slightly to ensure document.referrer is ready and not blocking main thread
    const timer = setTimeout(track, 500)
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
